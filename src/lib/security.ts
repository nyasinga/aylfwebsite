import { env } from './env'
import crypto from 'crypto'
import logger from './logger'

/**
 * Application key utilities for encryption and security
 */
export class Security {
  private static readonly ALGORITHM = 'aes-256-gcm'
  private static readonly IV_LENGTH = 16
  private static readonly SALT_LENGTH = 64
  private static readonly TAG_LENGTH = 16
  private static readonly KEY_LENGTH = 32

  /**
   * Get encryption key from APP_KEY
   */
  private static getKey(): Buffer {
    const key = crypto
      .createHash('sha256')
      .update(env.APP_KEY)
      .digest()
    return key
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH)
      const key = this.getKey()
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv)

      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      const tag = cipher.getAuthTag()

      // Combine iv, tag, and encrypted data
      return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
    } catch (error) {
      logger.error('Encryption failed', { error })
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':')
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format')
      }

      const iv = Buffer.from(parts[0], 'hex')
      const tag = Buffer.from(parts[1], 'hex')
      const encrypted = parts[2]

      const key = this.getKey()
      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv)
      decipher.setAuthTag(tag)

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      logger.error('Decryption failed', { error })
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Generate a secure random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hash a value using SHA-256
   */
  static hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex')
  }

  /**
   * Verify environment security
   */
  static verifyEnvironment(): void {
    if (env.NODE_ENV === 'production') {
      if (env.APP_KEY.length < 32) {
        logger.warn('APP_KEY is too short for production use')
      }
      if (env.APP_KEY.includes('your-secret-key') || env.APP_KEY.includes('change-this')) {
        throw new Error('APP_KEY must be changed from default value in production')
      }
    }
  }
}

// Verify security on module load
Security.verifyEnvironment()
