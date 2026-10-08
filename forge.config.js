const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

const certificateFile = process.env.WINDOWS_CERTIFICATE_FILE;
const certificatePassword = process.env.WINDOWS_CERTIFICATE_PASSWORD;

if (certificateFile && !certificatePassword) {
  throw new Error('WINDOWS_CERTIFICATE_PASSWORD es obligatorio cuando se define WINDOWS_CERTIFICATE_FILE.');
}

const windowsSigningConfig = certificateFile
  ? {
      certificateFile: path.resolve(certificateFile),
      certificatePassword,
    }
  : {};

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, '28-logo'),
    executableName: 'karate-scoreboard-akt',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'karate-scoreboard-akt',
        authors: 'Asociación de Karate y Artes Marciales de Tamaulipas',
        description: 'Marcador y gestor de competencias de karate AKT',
        setupIcon: path.resolve(__dirname, '28-logo.ico'),
        ...windowsSigningConfig,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
