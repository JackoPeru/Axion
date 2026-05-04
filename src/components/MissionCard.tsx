import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Faction, Mission, Reward, Zone } from '../types/domain';
import { theme } from '../theme/theme';
import { FactionBadge } from './FactionBadge';

type MissionCardProps = {
  mission: Mission;
  zone?: Zone;
  reward?: Reward;
  recommendedFaction?: Faction;
  onPress: () => void;
};

export function MissionCard({ mission, onPress, recommendedFaction, reward, zone }: MissionCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topLine} />
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.type}>{mission.type.replace(/_/g, ' ')}</Text>
          <Text style={styles.title}>{mission.title}</Text>
        </View>
        <View style={[styles.statusPill, mission.status === 'active' && styles.activePill, mission.status === 'completed' && styles.completedPill]}>
          <Text style={styles.status}>{mission.status}</Text>
        </View>
      </View>
      <Text style={styles.description}>{mission.description}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons color={theme.colors.textMuted} name="location-outline" size={14} />
          <Text style={styles.meta}>{zone?.name ?? 'Zona ignota'}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons color={theme.colors.textMuted} name="time-outline" size={14} />
          <Text style={styles.meta}>{mission.estimatedDurationMinutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons color={theme.colors.textMuted} name="speedometer-outline" size={14} />
          <Text style={styles.meta}>{mission.difficulty}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        {recommendedFaction ? <FactionBadge faction={recommendedFaction} compact /> : <Text style={styles.meta}>Aperta a tutte</Text>}
        <Text style={styles.points}>+{mission.userPoints} XP  +{mission.factionPoints} FZ</Text>
      </View>
      {reward ? <Text style={styles.reward}>Reward: {reward.title}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  topLine: {
    backgroundColor: theme.colors.gold,
    height: 2,
    opacity: 0.65,
    width: 58,
  },
  pressed: {
    opacity: 0.82,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
  },
  titleGroup: {
    flex: 1,
    gap: 3,
  },
  type: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusPill: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  activePill: {
    borderColor: theme.colors.warning,
  },
  completedPill: {
    borderColor: theme.colors.success,
  },
  status: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  description: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  points: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  reward: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
});
