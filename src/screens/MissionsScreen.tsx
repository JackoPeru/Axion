import type { Faction, FactionScores, Mission, PartnerVenue, Reward, UserProfile, Zone } from '../types/domain';
import { factions } from '../data/mockData';
import { MissionCard } from '../components/MissionCard';
import { Screen } from '../components/Screen';

type MissionsScreenProps = {
  faction: Faction;
  factionScores: FactionScores;
  missions: Mission[];
  partnerVenues: PartnerVenue[];
  rewards: Reward[];
  user: UserProfile;
  zones: Zone[];
  onAcceptMission: (mission: Mission) => void;
  onOpenMission: (missionId: string) => void;
};

export function MissionsScreen({ missions, onOpenMission, rewards, zones }: MissionsScreenProps) {
  return (
    <Screen eyebrow="Mission board" title="Operazioni disponibili" subtitle="Ogni missione muove punti personali, score fazione e controllo territoriale.">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onPress={() => onOpenMission(mission.id)}
          recommendedFaction={factions.find((faction) => faction.id === mission.recommendedFactionId)}
          reward={rewards.find((reward) => reward.id === mission.rewardId)}
          zone={zones.find((zone) => zone.id === mission.zoneId)}
        />
      ))}
    </Screen>
  );
}
