import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Faction, Zone } from '../types/domain';
import { theme } from '../theme/theme';
import { getFactionName } from '../utils/gameLogic';

type ZoneControlCardProps = {
  factions: Faction[];
  zone: Zone;
  onPress?: () => void;
};

export function ZoneControlCard({ factions, onPress, zone }: ZoneControlCardProps) {
  const owner = factions.find((faction) => faction.id === zone.controllingFactionId);

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{zone.name}</Text>
          <Text style={styles.district}>{zone.district}</Text>
        </View>
        <View style={styles.ownerWrap}>
          <Ionicons color={owner?.color ?? theme.colors.textMuted} name="radio-button-on" size={12} />
          <Text style={[styles.owner, owner && { color: owner.color }]}>{getFactionName(zone.controllingFactionId, factions)}</Text>
        </View>
      </View>
      <Text style={styles.description}>{zone.description}</Text>
      <View style={styles.bars}>
        {factions.map((faction) => (
          <View key={faction.id} style={styles.barLine}>
            <Text style={styles.barLabel}>{faction.name}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${zone.control[faction.id]}%`, backgroundColor: faction.color }]} />
            </View>
            <Text style={styles.barValue}>{zone.control[faction.id]}%</Text>
          </View>
        ))}
      </View>
      <Text style={styles.heat}>Heat level {zone.heatLevel}</Text>
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
  pressed: {
    opacity: 0.82,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  district: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  owner: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  ownerWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  description: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  bars: {
    gap: 8,
  },
  barLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  barLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    width: 68,
  },
  barTrack: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 999,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 999,
    height: 8,
  },
  barValue: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textAlign: 'right',
    width: 34,
  },
  heat: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
});
