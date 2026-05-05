import { Fragment, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Circle, Marker, UrlTile, type Region } from 'react-native-maps';
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

export function MapScreen({ missions, onOpenMission, partnerVenues, zones }: MapScreenProps) {
  const [locationStatus, setLocationStatus] = useState('Posizione non ancora richiesta.');
  const [userCoordinate, setUserCoordinate] = useState<{ latitude: number; longitude: number }>();

  const initialRegion = useMemo<Region>(() => {
    const firstZone = zones[0];
    return {
      latitude: firstZone?.center.latitude ?? 45.4642,
      longitude: firstZone?.center.longitude ?? 9.19,
      latitudeDelta: 0.055,
      longitudeDelta: 0.055,
    };
  }, [zones]);

  useEffect(() => {
    let mounted = true;

    Location.requestForegroundPermissionsAsync()
      .then((permission) => {
        if (!permission.granted) {
          setLocationStatus('Permesso posizione non concesso. Mappa zone disponibile senza posizione utente.');
          return undefined;
        }

        return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      })
      .then((position) => {
        if (position && mounted) {
          setUserCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus('Posizione utente attiva.');
        }
      })
      .catch(() => setLocationStatus('Posizione non disponibile. Verifica GPS dispositivo.'));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen eyebrow="Mappa reale" title="Zone operative" subtitle={locationStatus}>
      <View style={styles.mapFrame}>
        <MapView
          initialRegion={initialRegion}
          mapType="none"
          showsCompass
          showsUserLocation={Boolean(userCoordinate)}
          style={styles.map}
        >
          <UrlTile maximumZ={19} tileSize={256} urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {zones.map((zone) => {
            const owner = factions.find((faction) => faction.id === zone.controllingFactionId);
            const zoneMission = missions.find((mission) => mission.zoneId === zone.id && mission.status !== 'completed');
            return (
              <Fragment key={zone.id}>
                <Circle
                  center={zone.center}
                  fillColor={`${owner?.color ?? '#C8A96A'}26`}
                  radius={zone.radiusMeters}
                  strokeColor={owner?.color ?? theme.colors.gold}
                  strokeWidth={2}
                />
                <Marker
                  coordinate={zone.center}
                  description={`Heat ${zone.heatLevel} / ${owner?.name ?? 'N.D.'}`}
                  onPress={zoneMission ? () => onOpenMission(zoneMission.id) : undefined}
                  pinColor={owner?.color ?? theme.colors.gold}
                  title={zone.name}
                />
              </Fragment>
            );
          })}
          {partnerVenues.map((venue) => (
            <Marker
              key={venue.id}
              coordinate={venue.coordinates}
              description={`${venue.category} / outpost ${venue.outpostCode}`}
              pinColor={theme.colors.gold}
              title={venue.name}
            />
          ))}
        </MapView>
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
  mapFrame: {
    backgroundColor: '#0B1018',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 360,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
