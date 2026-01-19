import { PrismaClient, Page } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreatePageDTO, UpdatePageDTO } from '../types/page.types'
import prisma from '@/lib/db'

export class PageRepository extends BaseRepository<Page, CreatePageDTO, UpdatePageDTO> {
  constructor() {
    super(prisma, 'Page')
  }

  async findById(id: string): Promise<Page | null> {
    try {
      return await this.prisma.page.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findBySlug(slug: string): Promise<Page | null> {
    try {
      return await this.prisma.page.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findBySlug')
    }
  }

  async findAll(options?: FindAllOptions): Promise<Page[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { order: 'asc' },
        include: {
          parent: true,
          children: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async findPublished(): Promise<Page[]> {
    try {
      return await this.prisma.page.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          parent: true,
          children: { where: { isPublished: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'findPublished')
    }
  }

  async create(data: CreatePageDTO): Promise<Page> {
    try {
      return await this.prisma.page.create({
        data: {
          ...data,
          publishedAt: data.isPublished ? new Date() : null,
        },
        include: {
          parent: true,
          children: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdatePageDTO): Promise<Page> {
    try {
      return await this.prisma.page.update({
        where: { id },
        data: {
          ...data,
          publishedAt:
            data.isPublished === true
              ? new Date()
              : data.isPublished === false
                ? null
                : undefined,
        },
        include: {
          parent: true,
          children: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.page.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<Page>): Promise<number> {
    try {
      return await this.prisma.page.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }
}
