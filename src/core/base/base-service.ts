import { IService, ServiceOptions } from '../interfaces/service.interface'
import logger from '@/lib/logger'

/**
 * Base service implementation
 * Provides common business logic patterns
 */
export abstract class BaseService<T, CreateDTO, UpdateDTO>
  implements IService<T, CreateDTO, UpdateDTO>
{
  protected serviceName: string

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  abstract getById(id: string): Promise<T>
  abstract getAll(options?: ServiceOptions): Promise<T[]>
  abstract create(data: CreateDTO): Promise<T>
  abstract update(id: string, data: UpdateDTO): Promise<T>
  abstract delete(id: string): Promise<void>

  protected handleError(error: unknown, operation: string): never {
    logger.error(`Service error in ${this.serviceName}.${operation}`, { error })
    throw error
  }

  protected validateId(id: string): void {
    if (!id || id.trim() === '') {
      throw new Error('Invalid ID provided')
    }
  }
}
