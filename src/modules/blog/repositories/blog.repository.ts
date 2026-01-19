import { PrismaClient, BlogPost } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreateBlogPostDTO, UpdateBlogPostDTO } from '../types/blog.types'
import prisma from '@/lib/db'

export class BlogRepository extends BaseRepository<BlogPost, CreateBlogPostDTO, UpdateBlogPostDTO> {
  constructor() {
    super(prisma, 'BlogPost')
  }

  async findById(id: string): Promise<BlogPost | null> {
    try {
      return await this.prisma.blogPost.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    try {
      return await this.prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findBySlug')
    }
  }

  async findAll(options?: FindAllOptions): Promise<BlogPost[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async create(data: CreateBlogPostDTO): Promise<BlogPost> {
    try {
      const { tagIds, ...postData } = data
      return await this.prisma.blogPost.create({
        data: {
          ...postData,
          publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
          tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateBlogPostDTO): Promise<BlogPost> {
    try {
      const { tagIds, ...updateData } = data
      return await this.prisma.blogPost.update({
        where: { id },
        data: {
          ...updateData,
          publishedAt:
            data.status === 'PUBLISHED'
              ? new Date()
              : data.status === 'DRAFT'
                ? null
                : undefined,
          tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.blogPost.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<BlogPost>): Promise<number> {
    try {
      return await this.prisma.blogPost.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      await this.prisma.blogPost.update({
        where: { id },
        data: { views: { increment: 1 } },
      })
    } catch (error) {
      this.handleError(error, 'incrementViews')
    }
  }
}
