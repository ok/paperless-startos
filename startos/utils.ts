import { randomBytes } from 'node:crypto'

export const uiPort = 8000
export const redisPort = 6379

const alphabet =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

export function generatePassword(length = 24): string {
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length]
  }
  return out
}

export function generateSecretKey(): string {
  return randomBytes(48).toString('base64url')
}
