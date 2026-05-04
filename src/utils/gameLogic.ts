import type { Faction, FactionId, FactionScores, Mission, MissionStatus, Reward, UserProfile, Zone } from '../types/domain';

type CompleteMissionInput = {
  mission: Mission;
  faction: Faction;
  zones: Zone[];
  factionScores: FactionScores;
  user: UserProfile;
};

export function getFactionName(factionId: FactionId, factions: Faction[]) {
  return factions.find((faction) => faction.id === factionId)?.name ?? 'Unknown';
}

export function getMissionsByStatus(missions: Mission[], status: MissionStatus) {
  return missions.filter((mission) => mission.status === status);
}

export function getMissionReward(mission: Mission, rewards: Reward[]) {
  return rewards.find((reward) => reward.id === mission.rewardId);
}

export function getUserRank(users: UserProfile[], userId: string) {
  const index = users.findIndex((user) => user.id === userId);
  return index >= 0 ? index + 1 : users.length + 1;
}

export function getDominantFaction(zone: Zone): FactionId {
  return (Object.entries(zone.control) as [FactionId, number][])
    .sort((left, right) => right[1] - left[1])[0][0];
}

export function completeMission(input: CompleteMissionInput) {
  const { faction, factionScores, mission, user, zones } = input;
  const boost = mission.difficulty === 'critical' ? 8 : mission.difficulty === 'high' ? 6 : mission.difficulty === 'medium' ? 4 : 3;

  const nextZones = zones.map((zone) => {
    if (zone.id !== mission.zoneId) {
      return zone;
    }

    const nextControl = {
      ...zone.control,
      [faction.id]: Math.min(100, zone.control[faction.id] + boost),
    };

    const controllingFactionId = getDominantFaction({ ...zone, control: nextControl });

    return {
      ...zone,
      control: nextControl,
      controllingFactionId,
      heatLevel: Math.min(100, zone.heatLevel + 3),
    };
  });

  return {
    factionScores: {
      ...factionScores,
      [faction.id]: factionScores[faction.id] + mission.factionPoints,
    },
    user: {
      ...user,
      points: user.points + mission.userPoints,
      level: Math.max(user.level, Math.floor((user.points + mission.userPoints) / 500) + 1),
      completedMissionIds: user.completedMissionIds.includes(mission.id)
        ? user.completedMissionIds
        : [...user.completedMissionIds, mission.id],
      statusTitle: user.points + mission.userPoints >= 1500 ? 'Field Operator' : user.statusTitle,
    },
    zones: nextZones,
  };
}
