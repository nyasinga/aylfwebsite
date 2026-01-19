import { NextRequest } from 'next/server'
import { PageService } from '../services/page.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { paginationSchema } from '@/lib/validation'
import { z } from 'zod'

const pageService = new PageService()

const createPageSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional().nullable(),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  isPublished: z.boolean().optional(),
  order: z.number().int().optional(),
  parentId: z.string().cuid().optional().nullable(),
})

const updatePageSchema = createPageSchema.partial()

export const getPages = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published') === 'true'

  if (published) {
    const pages = await pageService.getPublished()
    return successResponse(pages, 'Published pages retrieved successfully')
  }

  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const pages = await pageService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
  })

  return successResponse(pages, 'Pages retrieved successfully')
})

export const getPageById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Page ID is required', 400)
  }

  const page = await pageService.getById(id)
  return successResponse(page, 'Page retrieved successfully')
})

export const getPageBySlug = createApiHandler(async (request: NextRequest, context) => {
  const { slug } = context?.params || {}
  if (!slug) {
    return errorResponse('Page slug is required', 400)
  }

  const page = await pageService.getBySlug(slug)
  return successResponse(page, 'Page retrieved successfully')
})

export const createPage = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = createPageSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const page = await pageService.create(validation.data)
  return successResponse(page, 'Page created successfully', 201)
})

export const updatePage = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Page ID is required', 400)
  }

  const body = await request.json()
  const validation = updatePageSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const page = await pageService.update(id, validation.data)
  return successResponse(page, 'Page updated successfully')
})

export const deletePage = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Page ID is required', 400)
  }

  await pageService.delete(id)
  return successResponse(null, 'Page deleted successfully')
})
