import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ScreenName } from '../types/domain';
import { theme } from '../theme/theme';

const tabs: { icon: keyof typeof Ionicons.glyphMap; label: string; screen: ScreenName }[] = [
  { icon: 'pulse-outline', label: 'Home', screen: 'home' },
  { icon: 'map-outline', label: 'Zone', screen: 'map' },
  { icon: 'flash-outline', label: 'Missioni', screen: 'missions' },
  { icon: 'podium-outline', label: 'Rank', screen: 'leaderboard' },
  { icon: 'ticket-outline', label: 'Rewards', screen: 'rewards' },
  { icon: 'person-circle-outline', label: 'Profilo', screen: 'profile' },
];

type TabBarProps = {
  activeScreen: ScreenName;
  onChange: (screen: ScreenName) => void;
};

export function TabBar({ activeScreen, onChange }: TabBarProps) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.screen;
        return (
          <Pressable key={tab.screen} onPress={() => onChange(tab.screen)} style={[styles.tab, isActive && styles.activeTab]}>
            <Ionicons color={isActive ? theme.colors.text : theme.colors.textMuted} name={tab.icon} size={18} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(15,20,28,0.98)',
    borderColor: theme.colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    left: 0,
    padding: theme.spacing.sm,
    position: 'absolute',
    right: 0,
  },
  tab: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  activeLabel: {
    color: theme.colors.text,
  },
});
