import { NextRequest } from 'next/server'
import { MediaService } from '../services/media.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { paginationSchema } from '@/lib/validation'
import { z } from 'zod'

const mediaService = new MediaService()

const createMediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().positive(),
  path: z.string().min(1),
  url: z.string().url(),
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'OTHER']),
  uploadedById: z.string().cuid(),
})

const updateMediaSchema = z.object({
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
})

export const getMedia = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const type = searchParams.get('type')

  if (type) {
    const media = await mediaService.getByType(type)
    return successResponse(media, 'Media retrieved successfully')
  }

  const media = await mediaService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
  })

  return successResponse(media, 'Media retrieved successfully')
})

export const getMediaById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Media ID is required', 400)
  }

  const media = await mediaService.getById(id)
  return successResponse(media, 'Media retrieved successfully')
})

export const createMedia = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = createMediaSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const media = await mediaService.create(validation.data)
  return successResponse(media, 'Media created successfully', 201)
})

export const updateMedia = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Media ID is required', 400)
  }

  const body = await request.json()
  const validation = updateMediaSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const media = await mediaService.update(id, validation.data)
  return successResponse(media, 'Media updated successfully')
})

export const deleteMedia = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Media ID is required', 400)
  }

  await mediaService.delete(id)
  return successResponse(null, 'Media deleted successfully')
})
