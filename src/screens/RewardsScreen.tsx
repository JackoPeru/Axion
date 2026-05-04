import { StyleSheet, Text, View } from 'react-native';
import type { PartnerVenue, Reward, UserProfile } from '../types/domain';
import { theme } from '../theme/theme';
import { ActionButton } from '../components/ActionButton';
import { PartnerCard } from '../components/PartnerCard';
import { Screen } from '../components/Screen';

type RewardsScreenProps = {
  rewards: Reward[];
  user: UserProfile;
  venues: PartnerVenue[];
  onRedeemReward: (reward: Reward) => void;
};

export function RewardsScreen({ onRedeemReward, rewards, user, venues }: RewardsScreenProps) {
  return (
    <Screen eyebrow="Partner network" title="Rewards e avamposti" subtitle="Ricompense mock pensate per locali reali: sconti, accessi, perk e status.">
      <View style={styles.panel}>
        {rewards.map((reward) => {
          const unlocked = user.points >= reward.requiredPoints;
          const redeemed = user.redeemedRewardIds.includes(reward.id);
          const label = redeemed ? 'Riscattata' : unlocked ? 'Ritira' : 'Bloccata';
          return (
            <View key={reward.id} style={styles.rewardRow}>
              <View style={styles.rewardMeta}>
                <Text style={styles.title}>{reward.title}</Text>
                <Text style={styles.copy}>{reward.description}</Text>
                <Text style={styles.points}>{reward.requiredPoints} punti richiesti{redeemed ? ' / codice attivo nel profilo' : ''}</Text>
              </View>
              <ActionButton
                icon={redeemed ? 'checkmark-circle-outline' : unlocked ? 'ticket-outline' : 'lock-closed-outline'}
                label={label}
                disabled={!unlocked || redeemed}
                onPress={() => onRedeemReward(reward)}
                variant={unlocked && !redeemed ? 'secondary' : 'ghost'}
              />
            </View>
          );
        })}
      </View>
      {venues.map((venue) => (
        <PartnerCard key={venue.id} venue={venue} rewards={rewards.filter((reward) => venue.activeRewardIds.includes(reward.id))} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  rewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  rewardMeta: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  copy: {
    color: theme.colors.textSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  points: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
});
