import { StyleSheet, Text, View } from 'react-native';
import type { Faction, Mission, UserProfile } from '../types/domain';
import { theme } from '../theme/theme';
import { FactionBadge } from '../components/FactionBadge';
import { Screen } from '../components/Screen';
import { StatCard } from '../components/StatCard';
import { UpdatePanel } from '../components/UpdatePanel';

type ProfileScreenProps = {
  completedMissions: Mission[];
  faction: Faction;
  rank: number;
  rewardCount: number;
  user: UserProfile;
};

export function ProfileScreen({ completedMissions, faction, rank, rewardCount, user }: ProfileScreenProps) {
  return (
    <Screen eyebrow="Profilo operatore" title={user.alias} subtitle="Progressione locale, status e impatto sulla rete. Login e persistenza sono mock per MVP iniziale.">
      <FactionBadge faction={faction} />
      <View style={styles.stats}>
        <StatCard label="Punti" value={`${user.points}`} accentColor={faction.color} />
        <StatCard label="Livello" value={`${user.level}`} />
        <StatCard label="Rank" value={`#${rank}`} />
        <StatCard label="Rewards" value={`${rewardCount}`} />
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{user.statusTitle}</Text>
        <Text style={styles.label}>Missioni completate</Text>
        <Text style={styles.value}>{completedMissions.length}</Text>
      </View>
      <UpdatePanel />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  panel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 7,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
