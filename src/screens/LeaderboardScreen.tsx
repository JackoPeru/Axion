import { StyleSheet, Text, View } from 'react-native';
import type { Faction, FactionScores, UserProfile } from '../types/domain';
import { theme } from '../theme/theme';
import { Screen } from '../components/Screen';

type LeaderboardScreenProps = {
  factionScores: FactionScores;
  factions: Faction[];
  users: UserProfile[];
};

export function LeaderboardScreen({ factionScores, factions, users }: LeaderboardScreenProps) {
  return (
    <Screen eyebrow="Ranking locale" title="Classifica" subtitle="Status personale e pressione aggregata tra fazioni nella citta.">
      <View style={styles.panel}>
        {factions.map((faction) => (
          <View key={faction.id} style={styles.scoreRow}>
            <Text style={[styles.faction, { color: faction.color }]}>{faction.name}</Text>
            <Text style={styles.points}>{factionScores[faction.id]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.panel}>
        {users.map((user, index) => {
          const faction = factions.find((candidate) => candidate.id === user.factionId);
          return (
            <View key={user.id} style={styles.userRow}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.alias}>{user.alias}</Text>
                <Text style={styles.status}>{user.statusTitle}</Text>
              </View>
              <Text style={[styles.userFaction, faction && { color: faction.color }]}>{faction?.name ?? 'N.D.'}</Text>
              <Text style={styles.userPoints}>{user.points}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  scoreRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faction: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  points: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  rank: {
    color: theme.colors.textMuted,
    fontSize: 12,
    width: 32,
  },
  userMeta: {
    flex: 1,
  },
  alias: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  status: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  userFaction: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    width: 72,
  },
  userPoints: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    width: 48,
  },
});
