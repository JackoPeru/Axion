import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '../types/domain';
import { initialFactionScores, initialUserProfile, missions, zones } from '../data/mockData';

const STORAGE_KEY = '@axion/app-state/v1';

export function createInitialAppState(): AppState {
  return {
    activeScreen: 'home',
    selectedMissionId: missions[0]?.id ?? '',
    selectedFactionId: undefined,
    missionStatuses: Object.fromEntries(missions.map((mission) => [mission.id, mission.status])),
    zoneState: zones,
    factionScores: initialFactionScores,
    userProfile: initialUserProfile,
  };
}

export async function loadAppState(): Promise<AppState> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createInitialAppState();
  }

  try {
    const parsed = JSON.parse(saved) as Partial<AppState>;
    const fallback = createInitialAppState();

    return {
      ...fallback,
      ...parsed,
      missionStatuses: {
        ...fallback.missionStatuses,
        ...(parsed.missionStatuses ?? {}),
      },
      factionScores: {
        ...fallback.factionScores,
        ...(parsed.factionScores ?? {}),
      },
      userProfile: {
        ...fallback.userProfile,
        ...(parsed.userProfile ?? {}),
        redeemedRewardIds: parsed.userProfile?.redeemedRewardIds ?? fallback.userProfile.redeemedRewardIds,
        completedMissionIds: parsed.userProfile?.completedMissionIds ?? fallback.userProfile.completedMissionIds,
      },
      zoneState: parsed.zoneState?.length ? parsed.zoneState : fallback.zoneState,
    };
  } catch {
    return createInitialAppState();
  }
}

export async function saveAppState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function resetAppState() {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return createInitialAppState();
}
