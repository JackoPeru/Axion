import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { TabBar } from './src/components/TabBar';
import { factions, initialFactionScores, initialUserProfile, missions, partnerVenues, rewards, users, zones } from './src/data/mockData';
import type { Faction, Mission, MissionStatus, ScreenName, Zone } from './src/types/domain';
import { completeMission, getMissionReward, getMissionsByStatus, getUserRank } from './src/utils/gameLogic';
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
  const [selectedFaction, setSelectedFaction] = useState<Faction | undefined>(undefined);
  const [activeScreen, setActiveScreen] = useState<ScreenName>('home');
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id ?? '');
  const [missionStatuses, setMissionStatuses] = useState<Record<string, MissionStatus>>(
    Object.fromEntries(missions.map((mission) => [mission.id, mission.status]))
  );
  const [zoneState, setZoneState] = useState<Zone[]>(zones);
  const [factionScores, setFactionScores] = useState(initialFactionScores);
  const [userProfile, setUserProfile] = useState(initialUserProfile);

  const missionState = useMemo(
    () => missions.map((mission) => ({ ...mission, status: missionStatuses[mission.id] ?? mission.status })),
    [missionStatuses]
  );

  const selectedMission = missionState.find((mission) => mission.id === selectedMissionId) ?? missionState[0];
  const localLeaderboard = useMemo(
    () => [...users, userProfile].sort((left, right) => right.points - left.points),
    [userProfile]
  );

  const acceptMission = (mission: Mission) => {
    setSelectedMissionId(mission.id);
    setMissionStatuses((current) => ({ ...current, [mission.id]: 'active' }));
    setActiveScreen('missionDetail');
  };

  const finishMission = (mission: Mission) => {
    if (!selectedFaction || mission.status === 'completed') {
      return;
    }

    const result = completeMission({
      mission,
      faction: selectedFaction,
      zones: zoneState,
      factionScores,
      user: userProfile,
    });

    setMissionStatuses((current) => ({ ...current, [mission.id]: 'completed' }));
    setZoneState(result.zones);
    setFactionScores(result.factionScores);
    setUserProfile(result.user);
  };

  if (!selectedFaction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <OnboardingScreen
          factions={factions}
          onSelectFaction={(faction) => {
            setSelectedFaction(faction);
            setUserProfile((current) => ({ ...current, factionId: faction.id }));
          }}
        />
      </SafeAreaView>
    );
  }

  const openMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setActiveScreen('missionDetail');
  };

  const screenProps = {
    faction: selectedFaction,
    factionScores,
    missions: missionState,
    partnerVenues,
    rewards,
    user: userProfile,
    zones: zoneState,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={['#05070A', '#091018', '#05070A']} style={styles.appShell}>
        {activeScreen === 'home' && (
          <HomeScreen
            {...screenProps}
            activeMissions={getMissionsByStatus(missionState, 'active')}
            rank={getUserRank(localLeaderboard, userProfile.id)}
            onOpenMission={openMission}
            onNavigate={setActiveScreen}
          />
        )}
        {activeScreen === 'map' && <MapScreen {...screenProps} onOpenMission={openMission} />}
        {activeScreen === 'missions' && <MissionsScreen {...screenProps} onAcceptMission={acceptMission} onOpenMission={openMission} />}
        {activeScreen === 'leaderboard' && <LeaderboardScreen factions={factions} users={localLeaderboard} factionScores={factionScores} />}
        {activeScreen === 'faction' && <FactionScreen faction={selectedFaction} factions={factions} factionScores={factionScores} zones={zoneState} />}
        {activeScreen === 'rewards' && <RewardsScreen rewards={rewards} venues={partnerVenues} user={userProfile} />}
        {activeScreen === 'profile' && (
          <ProfileScreen
            faction={selectedFaction}
            user={userProfile}
            completedMissions={getMissionsByStatus(missionState, 'completed')}
            rank={getUserRank(localLeaderboard, userProfile.id)}
            rewardCount={rewards.filter((reward) => reward.requiredPoints <= userProfile.points).length}
          />
        )}
        {activeScreen === 'missionDetail' && selectedMission && (
          <MissionDetailScreen
            faction={selectedFaction}
            mission={selectedMission}
            reward={getMissionReward(selectedMission, rewards)}
            zone={zoneState.find((zone) => zone.id === selectedMission.zoneId)}
            onAcceptMission={acceptMission}
            onCompleteMission={finishMission}
            onBack={() => setActiveScreen('missions')}
          />
        )}
      </LinearGradient>
      <TabBar activeScreen={activeScreen} onChange={setActiveScreen} />
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
});
