import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function ActionButton({ disabled, icon, label, onPress, variant = 'primary' }: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
      {icon ? (
        <Ionicons
          color={variant === 'primary' ? theme.colors.background : theme.colors.text}
          name={icon}
          size={17}
        />
      ) : null}
      <Text style={[styles.label, variant !== 'primary' && styles.altLabel]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  primary: {
    backgroundColor: theme.colors.text,
    borderColor: '#FFFFFF',
  },
  secondary: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  altLabel: {
    color: theme.colors.text,
  },
});
