/**
 * Base repository interface
 * All repositories should implement this interface
 */
export interface IRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>
  findAll(options?: FindAllOptions): Promise<T[]>
  create(data: CreateInput): Promise<T>
  update(id: string, data: UpdateInput): Promise<T>
  delete(id: string): Promise<void>
  count(filter?: Partial<T>): Promise<number>
}

export interface FindAllOptions {
  page?: number
  limit?: number
  orderBy?: Record<string, 'asc' | 'desc'>
  where?: Record<string, unknown>
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
