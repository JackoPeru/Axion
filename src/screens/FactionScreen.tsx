import { StyleSheet, Text, View } from 'react-native';
import type { Faction, FactionScores, Zone } from '../types/domain';
import { theme } from '../theme/theme';
import { FactionBadge } from '../components/FactionBadge';
import { Screen } from '../components/Screen';
import { StatCard } from '../components/StatCard';
import { ZoneControlCard } from '../components/ZoneControlCard';

type FactionScreenProps = {
  faction: Faction;
  factions: Faction[];
  factionScores: FactionScores;
  zones: Zone[];
};

export function FactionScreen({ faction, factions, factionScores, zones }: FactionScreenProps) {
  const controlledZones = zones.filter((zone) => zone.controllingFactionId === faction.id);

  return (
    <Screen eyebrow="Fazione" title={faction.name} subtitle={faction.philosophy}>
      <FactionBadge faction={faction} />
      <View style={styles.stats}>
        <StatCard label="Score" value={`${factionScores[faction.id]}`} accentColor={faction.color} />
        <StatCard label="Zone" value={`${controlledZones.length}`} accentColor={faction.color} />
        <StatCard label="Tratti" value={`${faction.traits.length}`} accentColor={faction.color} />
      </View>
      <View style={styles.panel}>
        <Text style={styles.motto}>{faction.motto}</Text>
        <Text style={styles.copy}>{faction.playstyle}</Text>
        <Text style={styles.traits}>{faction.traits.join(' / ')}</Text>
      </View>
      {controlledZones.map((zone) => (
        <ZoneControlCard key={zone.id} factions={factions} zone={zone} />
      ))}
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
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  motto: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  copy: {
    color: theme.colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  traits: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
