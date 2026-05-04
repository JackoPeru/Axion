import type { Mission, MissionCompletionMethod, PartnerVenue, Zone } from '../types/domain';

export function getMissionCompletionMethod(mission: Mission): MissionCompletionMethod {
  if (mission.type === 'partner_qr_outpost') {
    return 'qr';
  }

  if (mission.type === 'zone_hold' || mission.type === 'territory_control') {
    return 'timer';
  }

  if (mission.requiresTeam || mission.type === 'flash_team' || mission.type === 'faction_jackpot') {
    return 'team';
  }

  return 'gps';
}

export function findMissionVenue(mission: Mission, venues: PartnerVenue[]) {
  return venues.find((venue) => venue.zoneId === mission.zoneId);
}

export function getMissionInstruction(mission: Mission, zone?: Zone, venue?: PartnerVenue) {
  const method = getMissionCompletionMethod(mission);

  if (method === 'qr') {
    return `Scansiona QR o inserisci codice outpost${venue ? ` ${venue.outpostCode}` : ''}.`;
  }

  if (method === 'timer') {
    return `Raggiungi ${zone?.name ?? 'zona'} e mantieni presidio per 30 secondi.`;
  }

  if (method === 'team') {
    return 'Conferma squadra lampo. In MVP la sincronizzazione e simulata localmente.';
  }

  return `Conferma presenza GPS entro raggio zona${zone ? ` (${zone.radiusMeters} m)` : ''}.`;
}
