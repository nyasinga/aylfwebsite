import { Media } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { MediaRepository } from '../repositories/media.repository'
import { CreateMediaDTO, UpdateMediaDTO, MediaResponse } from '../types/media.types'
import { NotFoundError } from '@/lib/errors'

export class MediaService extends BaseService<MediaResponse, CreateMediaDTO, UpdateMediaDTO> {
  private repository: MediaRepository

  constructor() {
    super('MediaService')
    this.repository = new MediaRepository()
  }

  async getById(id: string): Promise<MediaResponse> {
    this.validateId(id)
    const media = await this.repository.findById(id)
    if (!media) {
      throw new NotFoundError('Media')
    }
    return this.mapToResponse(media)
  }

  async getAll(options?: ServiceOptions): Promise<MediaResponse[]> {
    try {
      const mediaItems = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return mediaItems.map((item) => this.mapToResponse(item))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async getByType(type: string): Promise<MediaResponse[]> {
    try {
      const mediaItems = await this.repository.findByType(type)
      return mediaItems.map((item) => this.mapToResponse(item))
    } catch (error) {
      this.handleError(error, 'getByType')
    }
  }

  async create(data: CreateMediaDTO): Promise<MediaResponse> {
    try {
      const media = await this.repository.create(data)
      return this.mapToResponse(media)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateMediaDTO): Promise<MediaResponse> {
    this.validateId(id)
    const media = await this.repository.findById(id)
    if (!media) {
      throw new NotFoundError('Media')
    }

    try {
      const updatedMedia = await this.repository.update(id, data)
      return this.mapToResponse(updatedMedia)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const media = await this.repository.findById(id)
    if (!media) {
      throw new NotFoundError('Media')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  private mapToResponse(media: Media & { uploadedBy?: any }): MediaResponse {
    return {
      id: media.id,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      path: media.path,
      url: media.url,
      alt: media.alt,
      caption: media.caption,
      type: media.type,
      uploadedBy: media.uploadedBy,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    }
  }
}
