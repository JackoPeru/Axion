import { StyleSheet, Text, View } from 'react-native';
import type { Faction, Mission, Reward, Zone } from '../types/domain';
import { theme } from '../theme/theme';
import { ActionButton } from '../components/ActionButton';
import { FactionBadge } from '../components/FactionBadge';
import { Screen } from '../components/Screen';

type MissionDetailScreenProps = {
  faction: Faction;
  mission: Mission;
  reward?: Reward;
  zone?: Zone;
  onAcceptMission: (mission: Mission) => void;
  onBack: () => void;
  onCompleteMission: (mission: Mission) => void;
};

export function MissionDetailScreen({ faction, mission, onAcceptMission, onBack, onCompleteMission, reward, zone }: MissionDetailScreenProps) {
  const canAccept = mission.status === 'available';
  const canComplete = mission.status === 'active';

  return (
    <Screen eyebrow="Dettaglio missione" title={mission.title} subtitle={mission.description}>
      <FactionBadge faction={faction} />
      <View style={styles.panel}>
        <Text style={styles.label}>Zona</Text>
        <Text style={styles.value}>{zone?.name ?? 'Zona ignota'} / {zone?.district ?? 'N.D.'}</Text>
        <Text style={styles.label}>Finestra</Text>
        <Text style={styles.value}>{mission.estimatedDurationMinutes} min / scade {new Date(mission.expiresAt).toLocaleString('it-IT')}</Text>
        <Text style={styles.label}>Impatto</Text>
        <Text style={styles.value}>+{mission.userPoints} punti operatore / +{mission.factionPoints} punti fazione</Text>
        <Text style={styles.label}>Difficolta</Text>
        <Text style={styles.value}>{mission.difficulty}</Text>
        <Text style={styles.label}>Squadra</Text>
        <Text style={styles.value}>{mission.requiresTeam ? 'Richiesta' : 'Non richiesta'}</Text>
        {reward ? (
          <>
            <Text style={styles.label}>Ricompensa</Text>
            <Text style={styles.value}>{reward.title}: {reward.description}</Text>
          </>
        ) : null}
      </View>
      <View style={styles.actions}>
        <ActionButton icon="flash-outline" label="Accetta missione" disabled={!canAccept} onPress={() => onAcceptMission(mission)} />
        <ActionButton icon="checkmark-done-outline" label="Completa simulazione" disabled={!canComplete} onPress={() => onCompleteMission(mission)} variant="secondary" />
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
  actions: {
    gap: theme.spacing.sm,
  },
});
