import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { TabBar } from './src/components/TabBar';
import { ScreenErrorBoundary } from './src/components/ScreenErrorBoundary';
import { factions, missions, partnerVenues, rewards, users } from './src/data/mockData';
import type { AppState, Faction, Mission, MissionStatus, Reward, ScreenName } from './src/types/domain';
import { completeMission, getMissionReward, getMissionsByStatus, getUserRank } from './src/utils/gameLogic';
import { createInitialAppState, loadAppState, resetAppState, saveAppState } from './src/utils/appStateStorage';
import { recordMissionCompletion, recordRewardRedemption, syncProfile } from './src/services/backendSync';
import { authenticateWithEmail, type CloudAuthMode } from './src/services/authService';
import { isSupabaseConfigured } from './src/config/env';
import { theme } from './src/theme/theme';
import { FactionScreen } from './src/screens/FactionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { MapScreen } from './src/screens/MapScreen';
import { MissionDetailScreen } from './src/screens/MissionDetailScreen';
import { MissionsScreen } from './src/screens/MissionsScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';

export default function App() {
  const [appState, setAppState] = useState<AppState>(createInitialAppState());
  const [isReady, setIsReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string>();

  useEffect(() => {
    let mounted = true;

    loadAppState().then((loadedState) => {
      if (mounted) {
        setAppState(loadedState);
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      saveAppState(appState);
    }
  }, [appState, isReady]);

  const selectedFaction = factions.find((faction) => faction.id === appState.selectedFactionId);
  const missionState = useMemo(
    () => missions.map((mission) => ({ ...mission, status: appState.missionStatuses[mission.id] ?? mission.status })),
    [appState.missionStatuses]
  );

  const selectedMission = missionState.find((mission) => mission.id === appState.selectedMissionId) ?? missionState[0];
  const localLeaderboard = useMemo(
    () => [...users, appState.userProfile].sort((left, right) => right.points - left.points),
    [appState.userProfile]
  );

  const setActiveScreen = (activeScreen: ScreenName) => {
    setAppState((current) => ({ ...current, activeScreen }));
  };

  const setMissionStatus = (missionId: string, status: MissionStatus) => {
    setAppState((current) => ({
      ...current,
      missionStatuses: { ...current.missionStatuses, [missionId]: status },
    }));
  };

  const selectFaction = (faction: Faction, alias: string) => {
    Haptics.selectionAsync();
    setAppState((current) => {
      const nextState: AppState = {
        ...current,
        selectedFactionId: faction.id,
        userProfile: { ...current.userProfile, alias, factionId: faction.id },
        activeScreen: 'home',
      };
      syncProfile(nextState);
      return nextState;
    });
  };

  const cloudAuth = async (email: string, password: string, mode: CloudAuthMode) => {
    setAuthMessage('Connessione cloud...');
    const result = await authenticateWithEmail(email, password, mode);
    if (result.error) {
      setAuthMessage(result.error);
      return;
    }

    if (result.userId) {
      const userId = result.userId;
      setAppState((current) => ({
        ...current,
        userProfile: { ...current.userProfile, id: userId },
      }));
      setAuthMessage('Account cloud collegato. Scegli fazione.');
    }
  };

  const acceptMission = (mission: Mission) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAppState((current) => ({
      ...current,
      selectedMissionId: mission.id,
      missionStatuses: { ...current.missionStatuses, [mission.id]: 'active' },
      activeScreen: 'missionDetail',
    }));
  };

  const finishMission = (mission: Mission) => {
    if (!selectedFaction || mission.status === 'completed') {
      return;
    }

    const result = completeMission({
      mission,
      faction: selectedFaction,
      zones: appState.zoneState,
      factionScores: appState.factionScores,
      user: appState.userProfile,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const nextState: AppState = {
      ...appState,
      missionStatuses: { ...appState.missionStatuses, [mission.id]: 'completed' as MissionStatus },
      zoneState: result.zones,
      factionScores: result.factionScores,
      userProfile: result.user,
    };
    setAppState(nextState);
    syncProfile(nextState);
    recordMissionCompletion(nextState, mission);
  };

  const redeemReward = (reward: Reward) => {
    if (appState.userProfile.points < reward.requiredPoints || appState.userProfile.redeemedRewardIds.includes(reward.id)) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const nextState = {
      ...appState,
      userProfile: {
        ...appState.userProfile,
        redeemedRewardIds: [...appState.userProfile.redeemedRewardIds, reward.id],
      },
    };
    setAppState(nextState);
    syncProfile(nextState);
    recordRewardRedemption(nextState, reward);
  };

  const resetLocalState = async () => {
    const resetState = await resetAppState();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAppState(resetState);
  };

  const openMission = (missionId: string) => {
    setAppState((current) => ({
      ...current,
      selectedMissionId: missionId,
      activeScreen: 'missionDetail',
    }));
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.gold} />
          <Text style={styles.loadingText}>Sincronizzazione profilo locale</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedFaction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <OnboardingScreen
          authEnabled={isSupabaseConfigured()}
          authMessage={authMessage}
          factions={factions}
          onCloudAuth={cloudAuth}
          onSelectFaction={selectFaction}
        />
      </SafeAreaView>
    );
  }

  const screenProps = {
    faction: selectedFaction,
    factionScores: appState.factionScores,
    missions: missionState,
    partnerVenues,
    rewards,
    user: appState.userProfile,
    zones: appState.zoneState,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={['#05070A', '#091018', '#05070A']} style={styles.appShell}>
        <ScreenErrorBoundary onGoHome={() => setActiveScreen('home')} onResetLocalState={resetLocalState}>
          {appState.activeScreen === 'home' && (
            <HomeScreen
              {...screenProps}
              activeMissions={getMissionsByStatus(missionState, 'active')}
              rank={getUserRank(localLeaderboard, appState.userProfile.id)}
              onOpenMission={openMission}
              onNavigate={setActiveScreen}
            />
          )}
          {appState.activeScreen === 'map' && <MapScreen {...screenProps} onOpenMission={openMission} />}
          {appState.activeScreen === 'missions' && <MissionsScreen {...screenProps} onAcceptMission={acceptMission} onOpenMission={openMission} />}
          {appState.activeScreen === 'leaderboard' && <LeaderboardScreen factions={factions} users={localLeaderboard} factionScores={appState.factionScores} />}
          {appState.activeScreen === 'faction' && <FactionScreen faction={selectedFaction} factions={factions} factionScores={appState.factionScores} zones={appState.zoneState} />}
          {appState.activeScreen === 'rewards' && <RewardsScreen rewards={rewards} venues={partnerVenues} user={appState.userProfile} onRedeemReward={redeemReward} />}
          {appState.activeScreen === 'profile' && (
            <ProfileScreen
              faction={selectedFaction}
              user={appState.userProfile}
              completedMissions={getMissionsByStatus(missionState, 'completed')}
              rank={getUserRank(localLeaderboard, appState.userProfile.id)}
              rewardCount={rewards.filter((reward) => reward.requiredPoints <= appState.userProfile.points).length}
              onResetLocalState={resetLocalState}
            />
          )}
          {appState.activeScreen === 'missionDetail' && selectedMission && (
            <MissionDetailScreen
              faction={selectedFaction}
              mission={selectedMission}
              reward={getMissionReward(selectedMission, rewards)}
              zone={appState.zoneState.find((zone) => zone.id === selectedMission.zoneId)}
              venues={partnerVenues}
              onAcceptMission={acceptMission}
              onCompleteMission={finishMission}
              onBack={() => setActiveScreen('missions')}
              onExpireMission={(mission) => setMissionStatus(mission.id, 'expired')}
            />
          )}
        </ScreenErrorBoundary>
      </LinearGradient>
      <TabBar activeScreen={appState.activeScreen} onChange={setActiveScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appShell: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});
