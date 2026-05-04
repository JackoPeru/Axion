import type { LocationObject } from 'expo-location';
import type { Zone } from '../types/domain';
import { distanceMeters } from './geo';

export type LocationValidationResult = {
  ok: boolean;
  distance: number;
  reason: string;
};

const MAX_ACCURACY_METERS = 120;
const MAX_RADIUS_BUFFER_METERS = 45;

export function validateMissionLocation(position: LocationObject, zone: Zone): LocationValidationResult {
  const distance = distanceMeters(
    { latitude: position.coords.latitude, longitude: position.coords.longitude },
    zone.center
  );
  const accuracy = position.coords.accuracy ?? MAX_ACCURACY_METERS;

  if (accuracy > MAX_ACCURACY_METERS) {
    return {
      ok: false,
      distance,
      reason: `Segnale GPS impreciso (${Math.round(accuracy)} m). Spostati all'aperto e riprova.`,
    };
  }

  if (distance > zone.radiusMeters + MAX_RADIUS_BUFFER_METERS) {
    return {
      ok: false,
      distance,
      reason: `Fuori raggio operativo: ${Math.round(distance)} m.`,
    };
  }

  return {
    ok: true,
    distance,
    reason: 'Posizione validata.',
  };
}
