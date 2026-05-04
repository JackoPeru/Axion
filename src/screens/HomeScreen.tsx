import { StyleSheet, Text, View } from 'react-native';
import type { Faction, FactionScores, Mission, PartnerVenue, Reward, ScreenName, UserProfile, Zone } from '../types/domain';
import { factions as allFactions } from '../data/mockData';
import { theme } from '../theme/theme';
import { ActionButton } from '../components/ActionButton';
import { FactionBadge } from '../components/FactionBadge';
import { MissionCard } from '../components/MissionCard';
import { Screen } from '../components/Screen';
import { StatCard } from '../components/StatCard';
import { ZoneControlCard } from '../components/ZoneControlCard';

type HomeScreenProps = {
  activeMissions: Mission[];
  faction: Faction;
  factionScores: FactionScores;
  missions: Mission[];
  partnerVenues: PartnerVenue[];
  rank: number;
  rewards: Reward[];
  user: UserProfile;
  zones: Zone[];
  onNavigate: (screen: ScreenName) => void;
  onOpenMission: (missionId: string) => void;
};

export function HomeScreen({ activeMissions, faction, factionScores, missions, onNavigate, onOpenMission, rank, rewards, user, zones }: HomeScreenProps) {
  const primaryMission = activeMissions[0] ?? missions.find((mission) => mission.status === 'available');
  const hottestZone = [...zones].sort((left, right) => right.heatLevel - left.heatLevel)[0];

  return (
    <Screen eyebrow="Centro operativo" title="Citta in movimento" subtitle="Missioni vive, zone contese, vantaggi partner. Muovi punti personali e pressione di fazione.">
      <View style={styles.identity}>
        <FactionBadge faction={faction} />
        <Text style={styles.alias}>{user.alias}</Text>
      </View>
      <View style={styles.stats}>
        <StatCard label="Punti" value={`${user.points}`} accentColor={faction.color} />
        <StatCard label="Rank locale" value={`#${rank}`} />
        <StatCard label="Score fazione" value={`${factionScores[faction.id]}`} accentColor={faction.color} />
      </View>
      <View style={styles.quickActions}>
        <ActionButton icon="flash-outline" label="Accetta missione" onPress={() => onNavigate('missions')} />
        <ActionButton icon="map-outline" label="Contribuisci alla zona" onPress={() => onNavigate('map')} variant="ghost" />
      </View>
      {primaryMission ? (
        <MissionCard
          mission={primaryMission}
          onPress={() => onOpenMission(primaryMission.id)}
          recommendedFaction={allFactions.find((candidate) => candidate.id === primaryMission.recommendedFactionId)}
          reward={rewards.find((reward) => reward.id === primaryMission.rewardId)}
          zone={zones.find((zone) => zone.id === primaryMission.zoneId)}
        />
      ) : null}
      {hottestZone ? <ZoneControlCard factions={allFactions} zone={hottestZone} onPress={() => onNavigate('map')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  alias: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
