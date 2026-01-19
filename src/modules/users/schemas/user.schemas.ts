import { z } from 'zod'
import { emailSchema, passwordSchema } from '@/lib/validation'

export const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(2).max(100).optional(),
  password: passwordSchema,
  role: z.enum(['USER', 'ADMIN', 'MODERATOR', 'EDITOR']).optional(),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: emailSchema.optional(),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR', 'EDITOR']).optional(),
  avatar: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
})

export const userIdSchema = z.object({
  id: z.string().cuid(),
})
