export type FactionId = 'vanguard' | 'syndicate' | 'eclipse';

export type MissionType =
  | 'timed_checkpoint'
  | 'package_retrieval'
  | 'zone_hold'
  | 'partner_qr_outpost'
  | 'flash_team'
  | 'mobile_target'
  | 'faction_jackpot'
  | 'private_host'
  | 'evening_chain'
  | 'territory_control';

export type MissionStatus = 'available' | 'active' | 'completed' | 'expired';
export type Difficulty = 'low' | 'medium' | 'high' | 'critical';
export type RewardType = 'discount' | 'access' | 'perk' | 'cashback' | 'status';
export type ScreenName = 'home' | 'map' | 'missions' | 'leaderboard' | 'faction' | 'rewards' | 'profile' | 'missionDetail';
export type MissionCompletionMethod = 'gps' | 'qr' | 'timer' | 'team' | 'demo';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Faction = {
  id: FactionId;
  name: string;
  color: string;
  motto: string;
  philosophy: string;
  playstyle: string;
  traits: string[];
};

export type ZoneControl = Record<FactionId, number>;

export type Zone = {
  id: string;
  name: string;
  district: string;
  description: string;
  center: Coordinates;
  radiusMeters: number;
  controllingFactionId: FactionId;
  control: ZoneControl;
  heatLevel: number;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  recommendedFactionId?: FactionId;
  zoneId: string;
  estimatedDurationMinutes: number;
  expiresAt: string;
  userPoints: number;
  factionPoints: number;
  difficulty: Difficulty;
  rewardId?: string;
  status: MissionStatus;
  requiresTeam: boolean;
};

export type PartnerVenue = {
  id: string;
  name: string;
  category: string;
  zoneId: string;
  address: string;
  coordinates: Coordinates;
  outpostCode: string;
  activeRewardIds: string[];
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  partnerVenueId?: string;
  requiredPoints: number;
  expiresAt?: string;
};

export type UserProfile = {
  id: string;
  alias: string;
  factionId: FactionId;
  level: number;
  statusTitle: string;
  points: number;
  completedMissionIds: string[];
  redeemedRewardIds: string[];
};

export type FactionScores = Record<FactionId, number>;

export type AppState = {
  activeScreen: ScreenName;
  selectedFactionId?: FactionId;
  selectedMissionId: string;
  missionStatuses: Record<string, MissionStatus>;
  zoneState: Zone[];
  factionScores: FactionScores;
  userProfile: UserProfile;
};
