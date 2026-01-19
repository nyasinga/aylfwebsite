/**
 * Base service interface
 * Services contain business logic and orchestrate repository calls
 */
export interface IService<T, CreateDTO, UpdateDTO> {
  getById(id: string): Promise<T>
  getAll(options?: ServiceOptions): Promise<T[]>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
}

export interface ServiceOptions {
  page?: number
  limit?: number
  orderBy?: Record<string, 'asc' | 'desc'>
  filter?: Record<string, unknown>
}
