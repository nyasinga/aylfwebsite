import { PrismaClient } from '@prisma/client'
import { IRepository, FindAllOptions, PaginatedResult } from '../interfaces/repository.interface'
import logger from '@/lib/logger'

/**
 * Base repository implementation
 * Provides common CRUD operations
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput>
  implements IRepository<T, CreateInput, UpdateInput>
{
  protected prisma: PrismaClient
  protected modelName: string

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma
    this.modelName = modelName
  }

  abstract findById(id: string): Promise<T | null>
  abstract findAll(options?: FindAllOptions): Promise<T[]>
  abstract create(data: CreateInput): Promise<T>
  abstract update(id: string, data: UpdateInput): Promise<T>
  abstract delete(id: string): Promise<void>
  abstract count(filter?: Partial<T>): Promise<number>

  protected async paginate<TData>(
    data: TData[],
    total: number,
    page: number,
    limit: number
  ): Promise<PaginatedResult<TData>> {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  protected handleError(error: unknown, operation: string): never {
    logger.error(`Repository error in ${this.modelName}.${operation}`, { error })
    throw error
  }
}
