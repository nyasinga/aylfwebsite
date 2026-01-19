import { Page } from '@prisma/client'

export interface CreatePageDTO {
  title: string
  slug: string
  content: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  isPublished?: boolean
  order?: number
  parentId?: string
}

export interface UpdatePageDTO {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  isPublished?: boolean
  order?: number
  parentId?: string
}

export interface PageResponse {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  metaTitle: string | null
  metaDescription: string | null
  isPublished: boolean
  publishedAt: Date | null
  order: number
  parent: PageResponse | null
  children: PageResponse[]
  createdAt: Date
  updatedAt: Date
}
