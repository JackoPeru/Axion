import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Faction } from '../types/domain';
import { theme } from '../theme/theme';

type OnboardingScreenProps = {
  factions: Faction[];
  onSelectFaction: (faction: Faction, alias: string) => void;
};

export function OnboardingScreen({ factions, onSelectFaction }: OnboardingScreenProps) {
  const [alias, setAlias] = useState('Operatore 17');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(244,241,234,0.08)', 'rgba(244,241,234,0.01)']} style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Ionicons color={theme.colors.gold} name="scan-outline" size={20} />
          </View>
          <Text style={styles.eyebrow}>Axion</Text>
        </View>
        <Text style={styles.title}>Scegli fazione. Entra nella citta attiva.</Text>
        <Text style={styles.subtitle}>
          Tre reti rivali competono per zone, vantaggi reali e status locale. La scelta determina stile operativo, ranking e missioni prioritarie.
        </Text>
      </LinearGradient>
      <View style={styles.loginPanel}>
        <Text style={styles.loginLabel}>Alias operativo</Text>
        <TextInput
          autoCapitalize="words"
          maxLength={24}
          onChangeText={setAlias}
          placeholder="Operatore 17"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          value={alias}
        />
      </View>
      <View style={styles.list}>
        {factions.map((faction) => (
          <Pressable
            key={faction.id}
            onPress={() => onSelectFaction(faction, alias.trim() || 'Operatore 17')}
            style={({ pressed }) => [styles.factionCard, { borderColor: faction.color }, pressed && styles.pressed]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.signal, { backgroundColor: faction.color, shadowColor: faction.color }]} />
              <Ionicons color={faction.color} name="chevron-forward" size={19} />
            </View>
            <Text style={[styles.name, { color: faction.color }]}>{faction.name}</Text>
            <Text style={styles.motto}>{faction.motto}</Text>
            <Text style={styles.copy}>{faction.playstyle}</Text>
            <Text style={styles.traits}>{faction.traits.join(' / ')}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  eyebrow: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
  subtitle: {
    color: theme.colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: theme.spacing.md,
  },
  loginPanel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  loginLabel: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: theme.spacing.md,
  },
  factionCard: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 7,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  pressed: {
    opacity: 0.82,
  },
  signal: {
    height: 3,
    width: 64,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  motto: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  copy: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  traits: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
