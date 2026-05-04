import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PartnerVenue, Reward } from '../types/domain';
import { theme } from '../theme/theme';

type PartnerCardProps = {
  venue: PartnerVenue;
  rewards: Reward[];
};

export function PartnerCard({ rewards, venue }: PartnerCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.meta}>{venue.category}</Text>
        </View>
        <Ionicons color={theme.colors.gold} name="qr-code-outline" size={22} />
      </View>
      <Text style={styles.meta}>{venue.address}</Text>
      <Text style={styles.code}>Outpost {venue.outpostCode}</Text>
      {rewards.map((reward) => (
        <Text key={reward.id} style={styles.reward}>{reward.title}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 7,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  code: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reward: {
    color: theme.colors.warning,
    fontSize: 13,
  },
});
