/**
 * Environment configuration loader
 * This file ensures environment variables are loaded before validation
 */
import { config } from 'dotenv'
import path from 'path'

// Load .env file in development
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.join(process.cwd(), '.env.local') })
  config({ path: path.join(process.cwd(), '.env') })
}

// Re-export env for use throughout the application
export { env } from '../lib/env'
