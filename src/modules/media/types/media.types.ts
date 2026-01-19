import { Media, MediaType } from '@prisma/client'

export interface CreateMediaDTO {
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  url: string
  alt?: string
  caption?: string
  type: MediaType
  uploadedById: string
}

export interface UpdateMediaDTO {
  alt?: string
  caption?: string
}

export interface MediaResponse {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  url: string
  alt: string | null
  caption: string | null
  type: MediaType
  uploadedBy: { id: string; name: string | null; email: string }
  createdAt: Date
  updatedAt: Date
}
