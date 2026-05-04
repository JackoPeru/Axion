import type { AppState, Mission, Reward } from '../types/domain';
import { isSupabaseConfigured } from '../config/env';
import { supabase } from './supabaseClient';

export type SyncStatus = 'disabled' | 'ok' | 'failed';

export async function syncProfile(state: AppState): Promise<SyncStatus> {
  if (!isSupabaseConfigured() || !supabase) {
    return 'disabled';
  }

  const { error } = await supabase.from('profiles').upsert({
    id: state.userProfile.id,
    alias: state.userProfile.alias,
    faction_id: state.userProfile.factionId,
    level: state.userProfile.level,
    points: state.userProfile.points,
    status_title: state.userProfile.statusTitle,
    updated_at: new Date().toISOString(),
  });

  return error ? 'failed' : 'ok';
}

export async function recordMissionCompletion(state: AppState, mission: Mission): Promise<SyncStatus> {
  if (!isSupabaseConfigured() || !supabase) {
    return 'disabled';
  }

  const { error } = await supabase.from('mission_completions').insert({
    mission_id: mission.id,
    user_id: state.userProfile.id,
    faction_id: state.userProfile.factionId,
    user_points: mission.userPoints,
    faction_points: mission.factionPoints,
    completed_at: new Date().toISOString(),
  });

  return error ? 'failed' : 'ok';
}

export async function recordRewardRedemption(state: AppState, reward: Reward): Promise<SyncStatus> {
  if (!isSupabaseConfigured() || !supabase) {
    return 'disabled';
  }

  const { error } = await supabase.from('reward_redemptions').insert({
    reward_id: reward.id,
    user_id: state.userProfile.id,
    redeemed_at: new Date().toISOString(),
  });

  return error ? 'failed' : 'ok';
}
