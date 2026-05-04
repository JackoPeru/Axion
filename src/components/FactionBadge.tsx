import { StyleSheet, Text, View } from 'react-native';
import type { Faction } from '../types/domain';
import { theme } from '../theme/theme';

type FactionBadgeProps = {
  faction: Faction;
  compact?: boolean;
};

export function FactionBadge({ compact, faction }: FactionBadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: faction.color }, compact && styles.compact]}>
      <View style={[styles.signal, { backgroundColor: faction.color, shadowColor: faction.color }]} />
      <Text style={styles.label}>{faction.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
  },
  compact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  signal: {
    borderRadius: 999,
    height: 8,
    width: 8,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});
