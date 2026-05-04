import { env } from '../config/env';

export function createSignedQrPayload(input: {
  missionId: string;
  venueId: string;
  outpostCode: string;
  issuedAt?: number;
}) {
  const issuedAt = input.issuedAt ?? Date.now();
  const body = `AXION:${input.venueId}:${input.missionId}:${input.outpostCode}:${issuedAt}`;
  return `${body}:${signQrBody(body)}`;
}

export function verifySignedQrPayload(value: string, expected: { missionId: string; venueId?: string; outpostCode?: string }) {
  const normalized = value.trim();
  const parts = normalized.split(':');

  if (parts.length !== 6 || parts[0] !== 'AXION') {
    return false;
  }

  const [, venueId, missionId, outpostCode, issuedAt, signature] = parts;
  if (expected.venueId && expected.venueId !== venueId) {
    return false;
  }
  if (expected.missionId !== missionId) {
    return false;
  }
  if (expected.outpostCode && expected.outpostCode !== outpostCode) {
    return false;
  }

  const timestamp = Number.parseInt(issuedAt, 10);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const ageMs = Math.abs(Date.now() - timestamp);
  if (ageMs > 1000 * 60 * 60 * 12) {
    return false;
  }

  return signQrBody(parts.slice(0, 5).join(':')) === signature;
}

function signQrBody(body: string) {
  let hash = 2166136261;
  const value = `${body}:${env.qrSigningSecret}`;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}
