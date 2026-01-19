import { BlogPost, PostStatus, BlogCategory, BlogTag } from '@prisma/client'

export type BlogPostEntity = BlogPost & {
  author: { id: string; name: string | null; email: string }
  category?: BlogCategory | null
  tags: BlogTag[]
}

export interface CreateBlogPostDTO {
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  status?: PostStatus
  authorId: string
  categoryId?: string
  tagIds?: string[]
}

export interface UpdateBlogPostDTO {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  featuredImage?: string
  status?: PostStatus
  categoryId?: string
  tagIds?: string[]
}

export interface BlogPostResponse {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  status: PostStatus
  publishedAt: Date | null
  author: { id: string; name: string | null; email: string }
  category: BlogCategory | null
  tags: BlogTag[]
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateBlogCategoryDTO {
  name: string
  slug: string
  description?: string
}

export interface CreateBlogTagDTO {
  name: string
  slug: string
}
