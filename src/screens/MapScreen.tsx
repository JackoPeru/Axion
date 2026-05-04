import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Faction, FactionScores, Mission, PartnerVenue, Reward, UserProfile, Zone } from '../types/domain';
import { factions } from '../data/mockData';
import { theme } from '../theme/theme';
import { Screen } from '../components/Screen';
import { ZoneControlCard } from '../components/ZoneControlCard';

type MapScreenProps = {
  faction: Faction;
  factionScores: FactionScores;
  missions: Mission[];
  partnerVenues: PartnerVenue[];
  rewards: Reward[];
  user: UserProfile;
  zones: Zone[];
  onOpenMission: (missionId: string) => void;
};

export function MapScreen({ missions, onOpenMission, zones }: MapScreenProps) {
  return (
    <Screen eyebrow="Vista zone" title="Mappa operativa" subtitle="Mock geografico pronto per sostituire vista zone con Mapbox, Google Maps o Expo Maps.">
      <View style={styles.mapMock}>
        <View style={[styles.gridLine, styles.gridLineHorizontal, { top: '30%' }]} />
        <View style={[styles.gridLine, styles.gridLineHorizontal, { top: '62%' }]} />
        <View style={[styles.gridLine, styles.gridLineVertical, { left: '34%' }]} />
        <View style={[styles.gridLine, styles.gridLineVertical, { left: '68%' }]} />
        <View style={styles.scanArea}>
          <Ionicons color={theme.colors.gold} name="scan-outline" size={30} />
          <Text style={styles.scanText}>CITY GRID</Text>
        </View>
        {zones.map((zone, index) => (
          <View
            key={zone.id}
            style={[
              styles.node,
              {
                left: `${12 + (index % 3) * 32}%`,
                top: `${14 + Math.floor(index / 3) * 42}%`,
                borderColor: factions.find((faction) => faction.id === zone.controllingFactionId)?.color ?? theme.colors.border,
              },
            ]}
          >
            <Text style={styles.nodeText}>{zone.district}</Text>
            <Text style={styles.nodeMeta}>{zone.heatLevel}</Text>
          </View>
        ))}
      </View>
      {zones.map((zone) => {
        const zoneMission = missions.find((mission) => mission.zoneId === zone.id && mission.status !== 'completed');
        return (
          <ZoneControlCard key={zone.id} factions={factions} zone={zone} onPress={zoneMission ? () => onOpenMission(zoneMission.id) : undefined} />
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapMock: {
    backgroundColor: '#0B1018',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 280,
    overflow: 'hidden',
  },
  gridLine: {
    backgroundColor: theme.colors.line,
    opacity: 0.75,
    position: 'absolute',
  },
  gridLineHorizontal: {
    height: 1,
    left: 0,
    right: 0,
  },
  gridLineVertical: {
    bottom: 0,
    top: 0,
    width: 1,
  },
  scanArea: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -56,
    marginTop: -56,
    opacity: 0.62,
    position: 'absolute',
    top: '50%',
    width: 112,
  },
  scanText: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 5,
  },
  node: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
    position: 'absolute',
    width: 86,
    ...theme.shadow.card,
  },
  nodeText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  nodeMeta: {
    color: theme.colors.warning,
    fontSize: 10,
    fontWeight: '900',
  },
});
