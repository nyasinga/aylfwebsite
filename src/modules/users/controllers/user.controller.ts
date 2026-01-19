import { NextRequest } from 'next/server'
import { UserService } from '../services/user.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { createUserSchema, updateUserSchema } from '../schemas/user.schemas'
import { paginationSchema } from '@/lib/validation'
import { withAdmin } from '@/lib/auth/with-auth'

const userService = new UserService()

export const getUsers = withAdmin(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const users = await userService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
  })

  return successResponse(users, 'Users retrieved successfully')
})

export const getUserById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('User ID is required', 400)
  }

  const user = await userService.getById(id)
  return successResponse(user, 'User retrieved successfully')
})

export const createUser = withAdmin(async (request: NextRequest, authUser) => {
  const body = await request.json()
  const validation = createUserSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const user = await userService.create(validation.data)
  return successResponse(user, 'User created successfully', 201)
})

export const updateUser = withAdmin(async (request: NextRequest, authUser, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('User ID is required', 400)
  }

  const body = await request.json()
  const validation = updateUserSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const updatedUser = await userService.update(id, validation.data)
  return successResponse(updatedUser, 'User updated successfully')
})

export const deleteUser = withAdmin(async (request: NextRequest, user, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('User ID is required', 400)
  }

  await userService.delete(id)
  return successResponse(null, 'User deleted successfully')
})
