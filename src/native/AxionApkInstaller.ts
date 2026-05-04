import { NativeModules, Platform } from 'react-native';

type AxionApkInstallerModule = {
  canRequestPackageInstalls: () => Promise<boolean>;
  openInstallPermissionSettings: () => Promise<boolean>;
  installApk: (fileUri: string) => Promise<string>;
};

const nativeModule = NativeModules.AxionApkInstaller as AxionApkInstallerModule | undefined;

export function hasNativeApkInstaller() {
  return Platform.OS === 'android' && !!nativeModule;
}

export async function canRequestPackageInstalls() {
  const installer = nativeModule;
  if (!installer || Platform.OS !== 'android') {
    return false;
  }

  return installer.canRequestPackageInstalls();
}

export async function openNativeInstallPermissionSettings() {
  const installer = nativeModule;
  if (!installer || Platform.OS !== 'android') {
    return false;
  }

  return installer.openInstallPermissionSettings();
}

export async function installApkWithNativeInstaller(fileUri: string) {
  const installer = nativeModule;
  if (!installer || Platform.OS !== 'android') {
    return undefined;
  }

  return installer.installApk(fileUri);
}
