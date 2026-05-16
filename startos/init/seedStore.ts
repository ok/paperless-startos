import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { generatePassword, generateSecretKey } from '../utils'

export const seedStore = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  await storeJson.merge(effects, {
    adminUser: 'admin',
    adminPassword: generatePassword(),
    secretKey: generateSecretKey(),
  })
})
