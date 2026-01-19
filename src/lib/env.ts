import { z } from 'zod'

const envSchema = z.object({
  // Application
  APP_NAME: z.string().default('AYLF Website'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Security
  APP_KEY: z.string().min(32, 'APP_KEY must be at least 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),

  // Database
  DATABASE_URL: z.string().url(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('./logs/app.log'),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // External Services (optional)
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`)
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars.join('\n')}\n\nPlease check your .env file.`
      )
    }
    throw error
  }
}

export const env = getEnv()
