import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { File, Paths, getContentUriAsync } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { updateConfig } from '../config/update';

export type UpdateCheckResult = {
  hasUpdate: boolean;
  latestVersion?: string;
  message: string;
  releaseUrl: string;
  assetUrl?: string;
};

export type UpdateDownloadResult = {
  fileUri: string;
  fileName: string;
  readableSize: string;
};

type GithubAsset = {
  name?: string;
  browser_download_url?: string;
};

type GithubRelease = {
  tag_name?: string;
  html_url?: string;
  assets?: GithubAsset[];
};

const INSTALL_APK_ACTION = 'android.intent.action.VIEW';
const APK_MIME = 'application/vnd.android.package-archive';
const FLAG_GRANT_READ_URI_PERMISSION = 1;

export function getLocalAppVersion() {
  return Application.nativeApplicationVersion ?? '1.0.0';
}

export async function checkGithubUpdate(localVersion = getLocalAppVersion()): Promise<UpdateCheckResult> {
  try {
    const response = await fetch(updateConfig.latestReleaseApi, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': `${updateConfig.appName}-Android`,
      },
    });

    if (!response.ok) {
      return {
        hasUpdate: false,
        message: 'Nessuna release GitHub trovata. Crea una release con tag vX.Y.Z e asset APK.',
        releaseUrl: updateConfig.releasesPage,
      };
    }

    const release = (await response.json()) as GithubRelease;
    const latestVersion = normalizeVersion(release.tag_name ?? '');
    const releaseUrl = release.html_url ?? updateConfig.releasesPage;
    const assetUrl = findReleaseAsset(release.assets ?? [], '.apk');
    const hasUpdate = compareVersions(latestVersion, localVersion) > 0;

    let message = hasUpdate
      ? `Aggiornamento disponibile: ${localVersion} -> ${latestVersion}.`
      : `App aggiornata. Versione locale: ${localVersion}, GitHub: ${latestVersion || 'N.D.'}.`;

    if (hasUpdate && !assetUrl) {
      message += ' Release trovata, ma manca asset Android .apk.';
    }

    return {
      hasUpdate,
      latestVersion,
      message,
      releaseUrl,
      assetUrl,
    };
  } catch (error) {
    return {
      hasUpdate: false,
      message: `Controllo update non riuscito: ${error instanceof Error ? error.message : 'errore rete'}.`,
      releaseUrl: updateConfig.releasesPage,
    };
  }
}

export async function downloadUpdateApk(
  assetUrl: string,
  version: string,
  onProgress: (progress: number, label: string) => void
): Promise<UpdateDownloadResult | undefined> {
  const fileName = `${updateConfig.filePrefix}-${normalizeVersion(version)}.apk`;
  const targetFile = new File(Paths.document, fileName);

  try {
    onProgress(0, 'Connessione release...');
    const downloadedFile = await File.downloadFileAsync(assetUrl, targetFile, {
      headers: {
        Accept: 'application/octet-stream',
        'User-Agent': `${updateConfig.appName}-Android`,
      },
      idempotent: true,
    });
    onProgress(1, readableFileSize(downloadedFile.size));
    return {
      fileUri: downloadedFile.uri,
      fileName,
      readableSize: readableFileSize(downloadedFile.size),
    };
  } catch {
    if (targetFile.exists) {
      targetFile.delete();
    }
    return undefined;
  }
}

export async function findDownloadedUpdateApk(version: string): Promise<UpdateDownloadResult | undefined> {
  const fileName = `${updateConfig.filePrefix}-${normalizeVersion(version)}.apk`;
  const file = new File(Paths.document, fileName);
  if (!file.exists) {
    return undefined;
  }

  return {
    fileUri: file.uri,
    fileName,
    readableSize: readableFileSize(file.size),
  };
}

export async function installDownloadedApk(fileUri: string) {
  if (Platform.OS !== 'android') {
    return 'Installazione APK disponibile solo su Android.';
  }

  try {
    const contentUri = await getContentUriAsync(fileUri);
    await IntentLauncher.startActivityAsync(INSTALL_APK_ACTION, {
      data: contentUri,
      flags: FLAG_GRANT_READ_URI_PERMISSION,
      type: APK_MIME,
    });
    return 'Installer Android aperto. Conferma aggiornamento.';
  } catch {
    return 'Installer non aperto. Abilita installazione da origini sconosciute per Secret Ops e riprova.';
  }
}

export async function openInstallPermissionSettings() {
  if (Platform.OS !== 'android') {
    return;
  }

  await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.MANAGE_UNKNOWN_APP_SOURCES, {
    data: `package:${Application.applicationId ?? 'com.secretops.app'}`,
  });
}

function findReleaseAsset(assets: GithubAsset[], suffix: string) {
  return assets.find((asset) => asset.name?.toLowerCase().endsWith(suffix))?.browser_download_url;
}

export function compareVersions(latest: string, local: string) {
  const latestParts = parseVersionParts(latest);
  const localParts = parseVersionParts(local);
  const length = Math.max(latestParts.length, localParts.length);

  for (let index = 0; index < length; index += 1) {
    const left = latestParts[index] ?? 0;
    const right = localParts[index] ?? 0;
    if (left !== right) {
      return left > right ? 1 : -1;
    }
  }

  return 0;
}

export function normalizeVersion(value: string) {
  return value.trim().replace(/^[vV]/, '');
}

function parseVersionParts(value: string) {
  return normalizeVersion(value)
    .split(/[+-]/)[0]
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function readableFileSize(bytes: number) {
  if (bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return unitIndex === 0 ? `${Math.round(size)} ${units[unitIndex]}` : `${size.toFixed(1)} ${units[unitIndex]}`;
}
