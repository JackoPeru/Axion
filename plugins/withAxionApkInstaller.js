const fs = require('fs');
const path = require('path');
const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

const MODULE_NAME = 'AxionApkInstaller';
const FILE_PROVIDER_AUTHORITY = '${applicationId}.fileprovider';

function withAxionApkInstaller(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults;
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    application.provider = application.provider || [];

    const hasProvider = application.provider.some(
      (provider) => provider.$?.['android:authorities'] === FILE_PROVIDER_AUTHORITY
    );

    if (!hasProvider) {
      application.provider.push({
        $: {
          'android:name': 'androidx.core.content.FileProvider',
          'android:authorities': FILE_PROVIDER_AUTHORITY,
          'android:exported': 'false',
          'android:grantUriPermissions': 'true',
        },
        'meta-data': [
          {
            $: {
              'android:name': 'android.support.FILE_PROVIDER_PATHS',
              'android:resource': '@xml/axion_apk_file_paths',
            },
          },
        ],
      });
    }

    return modConfig;
  });

  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const androidRoot = modConfig.modRequest.platformProjectRoot;
      const packageName = modConfig.android?.package || 'com.axion.app';
      const packagePath = packageName.replace(/\./g, path.sep);
      const mainPath = path.join(androidRoot, 'app', 'src', 'main');
      const javaDir = path.join(mainPath, 'java', ...packagePath.split(path.sep));
      const xmlDir = path.join(mainPath, 'res', 'xml');

      fs.mkdirSync(javaDir, { recursive: true });
      fs.mkdirSync(xmlDir, { recursive: true });

      fs.writeFileSync(
        path.join(xmlDir, 'axion_apk_file_paths.xml'),
        `<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android">\n    <files-path name="files" path="." />\n    <cache-path name="cache" path="." />\n    <external-files-path name="external_files" path="." />\n    <external-cache-path name="external_cache" path="." />\n</paths>\n`
      );

      fs.writeFileSync(path.join(javaDir, `${MODULE_NAME}Module.kt`), createModuleSource(packageName));
      fs.writeFileSync(path.join(javaDir, `${MODULE_NAME}Package.kt`), createPackageSource(packageName));

      const mainApplicationPath = path.join(javaDir, 'MainApplication.kt');
      if (fs.existsSync(mainApplicationPath)) {
        let mainApplication = fs.readFileSync(mainApplicationPath, 'utf8');
        if (!mainApplication.includes(`${MODULE_NAME}Package()`)) {
          mainApplication = mainApplication.replace(
            /PackageList\(this\)\.packages\.apply\s*\{\s*\n/,
            (match) => `${match}              add(${MODULE_NAME}Package())\n`
          );
          fs.writeFileSync(mainApplicationPath, mainApplication);
        }
      }

      return modConfig;
    },
  ]);
}

function createPackageSource(packageName) {
  return `package ${packageName}\n\nimport com.facebook.react.ReactPackage\nimport com.facebook.react.bridge.NativeModule\nimport com.facebook.react.bridge.ReactApplicationContext\nimport com.facebook.react.uimanager.ViewManager\n\nclass ${MODULE_NAME}Package : ReactPackage {\n  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {\n    return listOf(${MODULE_NAME}Module(reactContext))\n  }\n\n  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {\n    return emptyList()\n  }\n}\n`;
}

function createModuleSource(packageName) {
  return `package ${packageName}\n\nimport android.content.Intent\nimport android.net.Uri\nimport android.provider.Settings\nimport androidx.core.content.FileProvider\nimport com.facebook.react.bridge.Promise\nimport com.facebook.react.bridge.ReactApplicationContext\nimport com.facebook.react.bridge.ReactContextBaseJavaModule\nimport com.facebook.react.bridge.ReactMethod\nimport java.io.File\n\nclass ${MODULE_NAME}Module(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {\n  override fun getName(): String = "${MODULE_NAME}"\n\n  @ReactMethod\n  fun canRequestPackageInstalls(promise: Promise) {\n    promise.resolve(reactContext.packageManager.canRequestPackageInstalls())\n  }\n\n  @ReactMethod\n  fun openInstallPermissionSettings(promise: Promise) {\n    promise.resolve(openInstallSettingsIntent())\n  }\n\n  @ReactMethod\n  fun installApk(fileUri: String, promise: Promise) {\n    val apkFile = resolveFile(fileUri)\n    if (apkFile == null || !apkFile.exists()) {\n      promise.resolve("APK non trovato. Riscarica l'aggiornamento.")\n      return\n    }\n\n    if (!reactContext.packageManager.canRequestPackageInstalls()) {\n      openInstallSettingsIntent()\n      promise.resolve("Consenti ad Axion di installare APK sconosciuti, poi premi di nuovo Aggiorna.")\n      return\n    }\n\n    val contentUri = FileProvider.getUriForFile(\n      reactContext,\n      "\${reactContext.packageName}.fileprovider",\n      apkFile\n    )\n\n    val installIntent = Intent(Intent.ACTION_VIEW)\n      .setDataAndType(contentUri, APK_MIME)\n      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION)\n\n    promise.resolve(\n      if (openIntent(installIntent)) {\n        "Installer Android aperto. Conferma aggiornamento."\n      } else {\n        "Installer non aperto. Nessuna app di sistema ha gestito l'APK."\n      }\n    )\n  }\n\n  private fun resolveFile(fileUri: String): File? {\n    return try {\n      val uri = Uri.parse(fileUri)\n      when (uri.scheme) {\n        "file" -> uri.path?.let { File(it) }\n        null -> File(fileUri)\n        else -> null\n      }\n    } catch (_: Exception) {\n      null\n    }\n  }\n\n  private fun openInstallSettingsIntent(): Boolean {\n    val intent = Intent(\n      Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,\n      Uri.parse("package:\${reactContext.packageName}")\n    ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)\n    return openIntent(intent)\n  }\n\n  private fun openIntent(intent: Intent): Boolean {\n    return try {\n      reactContext.startActivity(intent)\n      true\n    } catch (_: Exception) {\n      false\n    }\n  }\n\n  private companion object {\n    const val APK_MIME = "application/vnd.android.package-archive"\n  }\n}\n`;
}

module.exports = withAxionApkInstaller;
