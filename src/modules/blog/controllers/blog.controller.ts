import { NextRequest } from 'next/server'
import { BlogService } from '../services/blog.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { createBlogPostSchema, updateBlogPostSchema } from '../schemas/blog.schemas'
import { paginationSchema } from '@/lib/validation'

const blogService = new BlogService()

export const getBlogPosts = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const status = searchParams.get('status')
  const categoryId = searchParams.get('categoryId')

  const posts = await blogService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
    filter: {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
    },
  })

  return successResponse(posts, 'Blog posts retrieved successfully')
})

export const getBlogPostById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Blog post ID is required', 400)
  }

  const post = await blogService.getById(id)
  return successResponse(post, 'Blog post retrieved successfully')
})

export const getBlogPostBySlug = createApiHandler(async (request: NextRequest, context) => {
  const { slug } = context?.params || {}
  if (!slug) {
    return errorResponse('Blog post slug is required', 400)
  }

  const post = await blogService.getBySlug(slug)
  return successResponse(post, 'Blog post retrieved successfully')
})

export const createBlogPost = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = createBlogPostSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const post = await blogService.create(validation.data)
  return successResponse(post, 'Blog post created successfully', 201)
})

export const updateBlogPost = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Blog post ID is required', 400)
  }

  const body = await request.json()
  const validation = updateBlogPostSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const post = await blogService.update(id, validation.data)
  return successResponse(post, 'Blog post updated successfully')
})

export const deleteBlogPost = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Blog post ID is required', 400)
  }

  await blogService.delete(id)
  return successResponse(null, 'Blog post deleted successfully')
})
