import { NextRequest } from 'next/server'
import { AuthService } from '../services/auth.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, validationErrorResponse } from '@/utils/api-response'
import { z } from 'zod'
import { emailSchema, passwordSchema } from '@/lib/validation'

const authService = new AuthService()

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2).max(100).optional(),
})

export const login = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = loginSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const result = await authService.login(validation.data)
  return successResponse(result, 'Login successful')
})

export const register = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = registerSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const result = await authService.register(validation.data)
  return successResponse(result, 'Registration successful', 201)
})

export const refresh = createApiHandler(async (request: NextRequest) => {
  const { requireAuth } = await import('@/lib/auth/middleware')
  const user = requireAuth(request)

  const token = await authService.refreshToken(user.userId)
  return successResponse({ token }, 'Token refreshed successfully')
})

export const me = createApiHandler(async (request: NextRequest) => {
  const { requireAuth } = await import('@/lib/auth/middleware')
  const user = requireAuth(request)

  const { UserService } = await import('@/modules/users/services/user.service')
  const userService = new UserService()
  const userData = await userService.getById(user.userId)

  return successResponse(userData, 'User data retrieved successfully')
})
