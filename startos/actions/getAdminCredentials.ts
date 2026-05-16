import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const getAdminCredentials = sdk.Action.withoutInput(
  'get-admin-credentials',

  async () => ({
    name: i18n('Get Admin Credentials'),
    description: i18n(
      'Retrieve the initial admin username and password for the Paperless-ngx web UI.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read((s) => s).once()

    return {
      version: '1' as const,
      title: 'Admin Credentials',
      message: i18n(
        'These credentials were generated on install. Change the password from inside Paperless-ngx after first login.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: store?.adminUser ?? 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: store?.adminPassword ?? 'UNKNOWN',
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
