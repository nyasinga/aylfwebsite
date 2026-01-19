import { PrismaClient, Media } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreateMediaDTO, UpdateMediaDTO } from '../types/media.types'
import prisma from '@/lib/db'

export class MediaRepository extends BaseRepository<Media, CreateMediaDTO, UpdateMediaDTO> {
  constructor() {
    super(prisma, 'Media')
  }

  async findById(id: string): Promise<Media | null> {
    try {
      return await this.prisma.media.findUnique({
        where: { id },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findAll(options?: FindAllOptions): Promise<Media[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async create(data: CreateMediaDTO): Promise<Media> {
    try {
      return await this.prisma.media.create({
        data,
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateMediaDTO): Promise<Media> {
    try {
      return await this.prisma.media.update({
        where: { id },
        data,
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.media.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<Media>): Promise<number> {
    try {
      return await this.prisma.media.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }

  async findByType(type: string): Promise<Media[]> {
    try {
      return await this.prisma.media.findMany({
        where: { type: type as any },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      this.handleError(error, 'findByType')
    }
  }
}
