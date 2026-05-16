import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort, redisPort } from './utils'

const dataMountpoint = '/usr/src/paperless/data'
const mediaMountpoint = '/usr/src/paperless/media'
const consumeMountpoint = '/usr/src/paperless/consume'
const exportMountpoint = '/usr/src/paperless/export'

export const main = sdk.setupMain(async ({ effects }) => {
  const store = await storeJson.read((s) => s).const(effects)

  const trustedOrigins =
    (await sdk.serviceInterface
      .getOwn(effects, 'ui', (i) => i?.addressInfo?.format('urlstring') ?? [])
      .const()) || []

  const redisSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'redis' },
    null,
    'paperless-redis',
  )

  const paperlessSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'paperless' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: 'data',
        mountpoint: dataMountpoint,
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: 'media',
        mountpoint: mediaMountpoint,
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: 'consume',
        mountpoint: consumeMountpoint,
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: 'export',
        mountpoint: exportMountpoint,
        readonly: false,
      }),
    'paperless-app',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('redis', {
      subcontainer: redisSub,
      exec: {
        command: sdk.useEntrypoint([
          'redis-server',
          '--bind',
          '127.0.0.1',
          '--port',
          `${redisPort}`,
          '--save',
          '',
          '--appendonly',
          'no',
        ]),
      },
      ready: {
        display: i18n('Task Broker'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, redisPort, {
            successMessage: i18n('Redis is ready'),
            errorMessage: i18n('Redis is not responding'),
          }),
      },
      requires: [],
    })
    .addDaemon('paperless', {
      subcontainer: paperlessSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          PAPERLESS_REDIS: `redis://127.0.0.1:${redisPort}`,
          PAPERLESS_PORT: `${uiPort}`,
          PAPERLESS_SECRET_KEY: store?.secretKey ?? '',
          PAPERLESS_ADMIN_USER: store?.adminUser ?? 'admin',
          PAPERLESS_ADMIN_PASSWORD: store?.adminPassword ?? '',
          PAPERLESS_ADMIN_MAIL: 'admin@localhost',
          PAPERLESS_ALLOWED_HOSTS: '*',
          PAPERLESS_CORS_ALLOWED_HOSTS: trustedOrigins.join(','),
          PAPERLESS_CSRF_TRUSTED_ORIGINS: trustedOrigins.join(','),
          PAPERLESS_TIME_ZONE: 'UTC',
          PAPERLESS_OCR_LANGUAGE: 'eng',
          USERMAP_UID: '1000',
          USERMAP_GID: '1000',
        },
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Paperless-ngx is ready'),
            errorMessage: i18n('Paperless-ngx is not responding'),
          }),
        gracePeriod: 120_000,
      },
      requires: ['redis'],
    })
})
