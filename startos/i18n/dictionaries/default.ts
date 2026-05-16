export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Task Broker': 0,
  'Redis is ready': 1,
  'Redis is not responding': 2,
  'Web Interface': 3,
  'Paperless-ngx is ready': 4,
  'Paperless-ngx is not responding': 5,

  // interfaces.ts
  'Web UI': 6,
  'The Paperless-ngx web interface': 7,

  // actions/getAdminCredentials.ts
  'Get Admin Credentials': 8,
  'Retrieve the initial admin username and password for the Paperless-ngx web UI.': 9,
  'These credentials were generated on install. Change the password from inside Paperless-ngx after first login.': 10,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
