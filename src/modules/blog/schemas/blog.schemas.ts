import { z } from 'zod'

export const createBlogPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  featuredImage: z.string().url().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  authorId: z.string().cuid(),
  categoryId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).optional(),
})

export const updateBlogPostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10).optional(),
  featuredImage: z.string().url().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
})

export const createTagSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})
