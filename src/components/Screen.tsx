import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

type ScreenProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Screen({ children, eyebrow, subtitle, title }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.01)']} style={styles.header}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </LinearGradient>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingBottom: 110,
  },
  header: {
    borderBottomColor: theme.colors.border,
    borderLeftColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderRightColor: 'rgba(255,255,255,0.03)',
    borderTopColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    gap: 8,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
  eyebrow: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: theme.colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
  },
});
