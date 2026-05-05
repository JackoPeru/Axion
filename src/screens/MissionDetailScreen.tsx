import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Location from 'expo-location';
import type { Faction, Mission, PartnerVenue, Reward, Zone } from '../types/domain';
import { theme } from '../theme/theme';
import { ActionButton } from '../components/ActionButton';
import { FactionBadge } from '../components/FactionBadge';
import { Screen } from '../components/Screen';
import { distanceMeters, formatDistance } from '../utils/geo';
import { findMissionVenue, getMissionCompletionMethod, getMissionInstruction } from '../utils/missionValidation';
import { validateMissionLocation } from '../utils/antiCheat';
import { createSignedQrPayload, verifySignedQrPayload } from '../utils/signedQr';

type MissionDetailScreenProps = {
  faction: Faction;
  mission: Mission;
  reward?: Reward;
  zone?: Zone;
  venues: PartnerVenue[];
  onAcceptMission: (mission: Mission) => void;
  onBack: () => void;
  onCompleteMission: (mission: Mission) => void;
  onExpireMission: (mission: Mission) => void;
};

export function MissionDetailScreen({
  faction,
  mission,
  onAcceptMission,
  onBack,
  onCompleteMission,
  onExpireMission,
  reward,
  venues,
  zone,
}: MissionDetailScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [distanceLabel, setDistanceLabel] = useState<string>();
  const [holdStartedAt, setHoldStartedAt] = useState<number>();
  const [holdSeconds, setHoldSeconds] = useState(0);

  const canAccept = mission.status === 'available';
  const canOperate = mission.status === 'active';
  const method = getMissionCompletionMethod(mission);
  const venue = useMemo(() => findMissionVenue(mission, venues), [mission, venues]);
  const expectedCode = venue?.outpostCode;
  const expectedSignedPayload = venue && expectedCode
    ? createSignedQrPayload({ missionId: mission.id, venueId: venue.id, outpostCode: expectedCode })
    : undefined;

  useEffect(() => {
    if (mission.status !== 'completed' && mission.status !== 'expired' && Date.now() > new Date(mission.expiresAt).getTime()) {
      onExpireMission(mission);
    }
  }, [mission, onExpireMission]);

  useEffect(() => {
    if (!holdStartedAt || mission.status !== 'active') {
      return undefined;
    }

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - holdStartedAt) / 1000);
      setHoldSeconds(seconds);
      if (seconds >= 30) {
        clearInterval(timer);
        setStatusMessage('Presidio verificato. Missione completata.');
        onCompleteMission(mission);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [holdStartedAt, mission, onCompleteMission]);

  const verifyGps = async () => {
    try {
      if (!zone) {
        setStatusMessage('Zona non trovata. Impossibile verificare GPS.');
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatusMessage('Permesso posizione negato. Abilitalo per missioni GPS.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const validation = validateMissionLocation(position, zone);
      setDistanceLabel(formatDistance(validation.distance));

      if (validation.ok) {
        setStatusMessage('Presenza GPS confermata. Missione completata.');
        onCompleteMission(mission);
        return;
      }

      setStatusMessage(validation.reason);
    } catch {
      setStatusMessage('Verifica GPS non disponibile sul dispositivo.');
      return;
    }
  };

  const verifyQrCode = (value: string) => {
    const normalizedValue = value.trim().toUpperCase();
    const normalizedExpected = expectedCode?.trim().toUpperCase();

    if (!normalizedExpected) {
      setStatusMessage('Nessun outpost associato a questa missione.');
      return;
    }

    const signedOk = venue
      ? verifySignedQrPayload(normalizedValue, { missionId: mission.id, outpostCode: normalizedExpected, venueId: venue.id })
      : false;

    if (signedOk || normalizedValue.includes(normalizedExpected)) {
      setIsScanning(false);
      setStatusMessage('Outpost verificato. Missione completata.');
      onCompleteMission(mission);
      return;
    }

    setStatusMessage('Codice non valido per questo avamposto.');
  };

  const openScanner = async () => {
    try {
      if (!cameraPermission?.granted) {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          setStatusMessage('Permesso camera negato. Inserisci codice outpost manualmente.');
          return;
        }
      }

      setIsScanning(true);
      setStatusMessage('Inquadra QR outpost partner.');
    } catch {
      setStatusMessage('Scanner camera non disponibile. Usa codice manuale.');
      setIsScanning(false);
    }
  };

  const handleScan = (result: BarcodeScanningResult) => {
    if (!isScanning) {
      return;
    }

    verifyQrCode(result.data);
  };

  const startHold = async () => {
    try {
      if (!zone) {
        setStatusMessage('Zona non trovata. Impossibile avviare presidio.');
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatusMessage('Permesso posizione negato. Avvio presidio simulato disponibile.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const validation = validateMissionLocation(position, zone);
      setDistanceLabel(formatDistance(validation.distance));

      if (!validation.ok) {
        setStatusMessage(validation.reason);
        return;
      }

      setHoldStartedAt(Date.now());
      setStatusMessage('Presidio avviato. Mantieni posizione per 30 secondi.');
    } catch {
      setStatusMessage('Presidio GPS non disponibile sul dispositivo.');
    }
  };

  const completeTeamMission = () => {
    setStatusMessage('Squadra MVP confermata. Missione completata.');
    onCompleteMission(mission);
  };

  const completeDemo = () => {
    setStatusMessage('Override demo eseguito. Missione completata.');
    onCompleteMission(mission);
  };

  const renderCompletionAction = () => {
    if (!canOperate) {
      return null;
    }

    if (method === 'qr') {
      return (
        <View style={styles.validationPanel}>
          <Text style={styles.label}>Verifica QR</Text>
          <Text style={styles.value}>{getMissionInstruction(mission, zone, venue)}</Text>
          {expectedSignedPayload ? <Text style={styles.hint}>Payload firmato test: {expectedSignedPayload}</Text> : null}
          {isScanning ? (
            <CameraView
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              facing="back"
              onBarcodeScanned={handleScan}
              style={styles.camera}
            />
          ) : null}
          <View style={styles.codeRow}>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setManualCode}
              placeholder={expectedCode ?? 'CODICE OUTPOST'}
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={manualCode}
            />
            <ActionButton icon="keypad-outline" label="Verifica" onPress={() => verifyQrCode(manualCode)} variant="secondary" />
          </View>
          <ActionButton icon="qr-code-outline" label={isScanning ? 'Scanner attivo' : 'Scansiona QR'} onPress={openScanner} />
        </View>
      );
    }

    if (method === 'timer') {
      return (
        <View style={styles.validationPanel}>
          <Text style={styles.label}>Presidio zona</Text>
          <Text style={styles.value}>{getMissionInstruction(mission, zone, venue)}</Text>
          {holdStartedAt ? <Text style={styles.timer}>{Math.min(30, holdSeconds)} / 30 sec</Text> : null}
          <ActionButton icon="radio-outline" label="Avvia presidio" onPress={startHold} variant="secondary" />
        </View>
      );
    }

    if (method === 'team') {
      return (
        <View style={styles.validationPanel}>
          <Text style={styles.label}>Squadra</Text>
          <Text style={styles.value}>{getMissionInstruction(mission, zone, venue)}</Text>
          <ActionButton icon="people-outline" label="Conferma squadra" onPress={completeTeamMission} variant="secondary" />
        </View>
      );
    }

    return (
      <View style={styles.validationPanel}>
        <Text style={styles.label}>Verifica GPS</Text>
        <Text style={styles.value}>{getMissionInstruction(mission, zone, venue)}</Text>
        <ActionButton icon="navigate-outline" label="Verifica posizione" onPress={verifyGps} variant="secondary" />
      </View>
    );
  };

  return (
    <Screen eyebrow="Dettaglio missione" title={mission.title} subtitle={mission.description}>
      <FactionBadge faction={faction} />
      <View style={styles.panel}>
        <Text style={styles.label}>Zona</Text>
        <Text style={styles.value}>{zone?.name ?? 'Zona ignota'} / {zone?.district ?? 'N.D.'}</Text>
        <Text style={styles.label}>Finestra</Text>
        <Text style={styles.value}>{mission.estimatedDurationMinutes} min / scade {new Date(mission.expiresAt).toLocaleString('it-IT')}</Text>
        <Text style={styles.label}>Metodo</Text>
        <Text style={styles.value}>{method.toUpperCase()}</Text>
        <Text style={styles.label}>Impatto</Text>
        <Text style={styles.value}>+{mission.userPoints} punti operatore / +{mission.factionPoints} punti fazione</Text>
        <Text style={styles.label}>Difficolta</Text>
        <Text style={styles.value}>{mission.difficulty}</Text>
        <Text style={styles.label}>Squadra</Text>
        <Text style={styles.value}>{mission.requiresTeam ? 'Richiesta' : 'Non richiesta'}</Text>
        {distanceLabel ? (
          <>
            <Text style={styles.label}>Distanza rilevata</Text>
            <Text style={styles.value}>{distanceLabel}</Text>
          </>
        ) : null}
        {reward ? (
          <>
            <Text style={styles.label}>Ricompensa</Text>
            <Text style={styles.value}>{reward.title}: {reward.description}</Text>
          </>
        ) : null}
      </View>

      {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}
      {renderCompletionAction()}

      <View style={styles.actions}>
        <ActionButton icon="flash-outline" label="Accetta missione" disabled={!canAccept} onPress={() => onAcceptMission(mission)} />
        <ActionButton icon="flask-outline" label="Override demo" disabled={!canOperate} onPress={completeDemo} variant="ghost" />
        <ActionButton icon="arrow-back-outline" label="Torna al board" onPress={onBack} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 7,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  validationPanel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  statusMessage: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    padding: theme.spacing.md,
  },
  camera: {
    borderRadius: theme.radius.md,
    height: 220,
    overflow: 'hidden',
  },
  codeRow: {
    gap: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  timer: {
    color: theme.colors.gold,
    fontSize: 22,
    fontWeight: '900',
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
