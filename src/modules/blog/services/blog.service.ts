import { BlogPost } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { BlogRepository } from '../repositories/blog.repository'
import {
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogPostResponse,
  BlogPostEntity,
} from '../types/blog.types'
import { NotFoundError } from '@/lib/errors'

export class BlogService extends BaseService<BlogPostResponse, CreateBlogPostDTO, UpdateBlogPostDTO> {
  private repository: BlogRepository

  constructor() {
    super('BlogService')
    this.repository = new BlogRepository()
  }

  async getById(id: string): Promise<BlogPostResponse> {
    this.validateId(id)
    const post = await this.repository.findById(id)
    if (!post) {
      throw new NotFoundError('Blog post')
    }
    return this.mapToResponse(post as BlogPostEntity)
  }

  async getBySlug(slug: string): Promise<BlogPostResponse> {
    const post = await this.repository.findBySlug(slug)
    if (!post) {
      throw new NotFoundError('Blog post')
    }
    // Increment views
    await this.repository.incrementViews(post.id)
    return this.mapToResponse(post as BlogPostEntity)
  }

  async getAll(options?: ServiceOptions): Promise<BlogPostResponse[]> {
    try {
      const posts = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return posts.map((post) => this.mapToResponse(post as BlogPostEntity))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async create(data: CreateBlogPostDTO): Promise<BlogPostResponse> {
    try {
      // Check if slug already exists
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Blog post with this slug already exists')
      }

      const post = await this.repository.create(data)
      return this.mapToResponse(post as BlogPostEntity)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateBlogPostDTO): Promise<BlogPostResponse> {
    this.validateId(id)
    const post = await this.repository.findById(id)
    if (!post) {
      throw new NotFoundError('Blog post')
    }

    // Check slug uniqueness if updating slug
    if (data.slug && data.slug !== post.slug) {
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Blog post with this slug already exists')
      }
    }

    try {
      const updatedPost = await this.repository.update(id, data)
      return this.mapToResponse(updatedPost as BlogPostEntity)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const post = await this.repository.findById(id)
    if (!post) {
      throw new NotFoundError('Blog post')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  private mapToResponse(post: BlogPostEntity): BlogPostResponse {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      status: post.status,
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category || null,
      tags: post.tags,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }
}
