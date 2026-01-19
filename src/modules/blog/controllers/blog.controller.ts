import { NextRequest } from 'next/server'
import { BlogService } from '../services/blog.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { createBlogPostSchema, updateBlogPostSchema } from '../schemas/blog.schemas'
import { paginationSchema } from '@/lib/validation'
import { withAuth, withEditor, withContributor } from '@/lib/auth/with-auth'

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

export const createBlogPost = withContributor(async (request: NextRequest, user) => {
  const body = await request.json()
  const validation = createBlogPostSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  // Set author to current user if not provided
  const data = { ...validation.data, authorId: validation.data.authorId || user.userId }
  const post = await blogService.create(data)
  return successResponse(post, 'Blog post created successfully', 201)
})

export const updateBlogPost = withContributor(async (request: NextRequest, user, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Blog post ID is required', 400)
  }

  // Check if user owns the post or is editor/admin
  const existingPost = await blogService.getById(id)
  if (existingPost.author.id !== user.userId && !['ADMIN', 'EDITOR'].includes(user.role)) {
    return errorResponse('You can only edit your own posts', 403)
  }

  const body = await request.json()
  const validation = updateBlogPostSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const post = await blogService.update(id, validation.data)
  return successResponse(post, 'Blog post updated successfully')
})

export const deleteBlogPost = withEditor(async (request: NextRequest, user, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Blog post ID is required', 400)
  }

  // Only admin can delete, or user can delete their own
  const existingPost = await blogService.getById(id)
  if (existingPost.author.id !== user.userId && user.role !== 'ADMIN') {
    return errorResponse('You can only delete your own posts', 403)
  }

  await blogService.delete(id)
  return successResponse(null, 'Blog post deleted successfully')
})
