import type { Coordinates } from '../types/domain';

const EARTH_RADIUS_METERS = 6371000;

export function distanceMeters(from: Coordinates, to: Coordinates) {
  const fromLat = degreesToRadians(from.latitude);
  const toLat = degreesToRadians(to.latitude);
  const deltaLat = degreesToRadians(to.latitude - from.latitude);
  const deltaLon = degreesToRadians(to.longitude - from.longitude);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}
