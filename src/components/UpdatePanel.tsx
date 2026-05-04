import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from './ActionButton';
import { theme } from '../theme/theme';
import {
  checkGithubUpdate,
  downloadUpdateApk,
  findDownloadedUpdateApk,
  getLocalAppVersion,
  installDownloadedApk,
  openInstallPermissionSettings,
  type UpdateDownloadResult,
} from '../utils/updateService';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'current' | 'downloading' | 'ready' | 'error';

export function UpdatePanel() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [message, setMessage] = useState('Controlla GitHub Releases per nuove versioni Android.');
  const [assetUrl, setAssetUrl] = useState<string | undefined>();
  const [latestVersion, setLatestVersion] = useState<string | undefined>();
  const [releaseUrl, setReleaseUrl] = useState<string | undefined>();
  const [download, setDownload] = useState<UpdateDownloadResult | undefined>();
  const [progress, setProgress] = useState<number | undefined>();
  const [progressLabel, setProgressLabel] = useState('');

  const localVersion = getLocalAppVersion();

  const checkForUpdates = async () => {
    setStatus('checking');
    setMessage('Controllo GitHub Releases...');
    setDownload(undefined);
    setProgress(undefined);
    setProgressLabel('');

    const result = await checkGithubUpdate(localVersion);
    setReleaseUrl(result.releaseUrl);
    setAssetUrl(result.assetUrl);
    setLatestVersion(result.latestVersion);

    if (result.hasUpdate && result.latestVersion) {
      const existingDownload = await findDownloadedUpdateApk(result.latestVersion);
      setDownload(existingDownload);
      setStatus(existingDownload ? 'ready' : 'available');
      setProgress(existingDownload ? 1 : undefined);
      setProgressLabel(existingDownload?.readableSize ?? '');
      setMessage(
        existingDownload
          ? 'Aggiornamento gia scaricato. Avvia installazione Android.'
          : result.assetUrl
            ? `${result.message} Scarica APK dentro app.`
            : result.message
      );
      return;
    }

    setStatus(result.hasUpdate ? 'available' : 'current');
    setMessage(result.message);
  };

  const downloadApk = async () => {
    if (!assetUrl || !latestVersion) {
      return;
    }

    setStatus('downloading');
    setMessage('Scaricamento APK in corso...');
    const result = await downloadUpdateApk(assetUrl, latestVersion, (nextProgress, label) => {
      setProgress(nextProgress);
      setProgressLabel(label);
    });

    if (!result) {
      setStatus('error');
      setMessage('Download non riuscito. Controlla release APK e riprova.');
      setProgress(undefined);
      setProgressLabel('');
      return;
    }

    setDownload(result);
    setStatus('ready');
    setProgress(1);
    setProgressLabel(result.readableSize);
    setMessage('APK pronto. Avvia installer Android.');
  };

  const installApk = async () => {
    if (!download) {
      return;
    }

    const installMessage = await installDownloadedApk(download.fileUri);
    setMessage(installMessage);
  };

  const isBusy = status === 'checking' || status === 'downloading';
  const progressPercent = progress === undefined ? undefined : Math.round(progress * 100);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons color={theme.colors.gold} name="cloud-download-outline" size={22} />
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Update Android</Text>
          <Text style={styles.subtitle}>Locale {localVersion}{latestVersion ? ` / GitHub ${latestVersion}` : ''}</Text>
        </View>
      </View>

      <Text style={styles.message}>{message}</Text>

      {progress !== undefined ? (
        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent ?? 0}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progressPercent}% {progressLabel}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <ActionButton icon="refresh-outline" label={isBusy ? 'Attendi' : 'Controlla'} disabled={isBusy} onPress={checkForUpdates} variant="secondary" />
        {status === 'available' && assetUrl ? (
          <ActionButton icon="download-outline" label="Scarica APK" onPress={downloadApk} />
        ) : null}
        {status === 'ready' && download ? (
          <ActionButton icon="open-outline" label="Aggiorna" onPress={installApk} />
        ) : null}
        <ActionButton icon="settings-outline" label="Permessi" onPress={openInstallPermissionSettings} variant="ghost" />
        {releaseUrl ? (
          <ActionButton icon="logo-github" label="Release" onPress={() => Linking.openURL(releaseUrl)} variant="ghost" />
        ) : null}
      </View>
    </View>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  titleGroup: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  message: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  progressBlock: {
    gap: 6,
  },
  progressTrack: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.gold,
    borderRadius: 999,
    height: 8,
  },
  progressLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
