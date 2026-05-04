import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

type StatCardProps = {
  label: string;
  value: string;
  accentColor?: string;
};

export function StatCard({ accentColor = theme.colors.success, label, value }: StatCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderTopWidth: 2,
    borderWidth: 1,
    flex: 1,
    minWidth: 136,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  value: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 5,
    textTransform: 'uppercase',
  },
});
