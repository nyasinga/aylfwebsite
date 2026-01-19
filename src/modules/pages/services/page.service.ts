import { Page } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { PageRepository } from '../repositories/page.repository'
import { CreatePageDTO, UpdatePageDTO, PageResponse } from '../types/page.types'
import { NotFoundError } from '@/lib/errors'

export class PageService extends BaseService<PageResponse, CreatePageDTO, UpdatePageDTO> {
  private repository: PageRepository

  constructor() {
    super('PageService')
    this.repository = new PageRepository()
  }

  async getById(id: string): Promise<PageResponse> {
    this.validateId(id)
    const page = await this.repository.findById(id)
    if (!page) {
      throw new NotFoundError('Page')
    }
    return this.mapToResponse(page)
  }

  async getBySlug(slug: string): Promise<PageResponse> {
    const page = await this.repository.findBySlug(slug)
    if (!page) {
      throw new NotFoundError('Page')
    }
    return this.mapToResponse(page)
  }

  async getAll(options?: ServiceOptions): Promise<PageResponse[]> {
    try {
      const pages = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return pages.map((page) => this.mapToResponse(page))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async getPublished(): Promise<PageResponse[]> {
    try {
      const pages = await this.repository.findPublished()
      return pages.map((page) => this.mapToResponse(page))
    } catch (error) {
      this.handleError(error, 'getPublished')
    }
  }

  async create(data: CreatePageDTO): Promise<PageResponse> {
    try {
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Page with this slug already exists')
      }

      const page = await this.repository.create(data)
      return this.mapToResponse(page)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdatePageDTO): Promise<PageResponse> {
    this.validateId(id)
    const page = await this.repository.findById(id)
    if (!page) {
      throw new NotFoundError('Page')
    }

    if (data.slug && data.slug !== page.slug) {
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Page with this slug already exists')
      }
    }

    try {
      const updatedPage = await this.repository.update(id, data)
      return this.mapToResponse(updatedPage)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const page = await this.repository.findById(id)
    if (!page) {
      throw new NotFoundError('Page')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  private mapToResponse(page: Page & { parent?: Page | null; children?: Page[] }): PageResponse {
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      isPublished: page.isPublished,
      publishedAt: page.publishedAt,
      order: page.order,
      parent: page.parent ? this.mapToResponse(page.parent) : null,
      children: page.children?.map((child) => this.mapToResponse(child)) || [],
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }
  }
}
