import { User, UserRole } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { UserRepository } from '../repositories/user.repository'
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../types/user.types'
import { NotFoundError } from '@/lib/errors'
import bcrypt from 'bcryptjs'

export class UserService extends BaseService<UserResponse, CreateUserDTO, UpdateUserDTO> {
  private repository: UserRepository

  constructor() {
    super('UserService')
    this.repository = new UserRepository()
  }

  async getById(id: string): Promise<UserResponse> {
    this.validateId(id)
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User')
    }
    return this.mapToResponse(user)
  }

  async getByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.repository.findByEmail(email)
    return user ? this.mapToResponse(user) : null
  }

  async getAll(options?: ServiceOptions): Promise<UserResponse[]> {
    try {
      const users = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return users.map((user) => this.mapToResponse(user))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async create(data: CreateUserDTO): Promise<UserResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.repository.findByEmail(data.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      const user = await this.repository.create({
        ...data,
        password: hashedPassword,
      })

      return this.mapToResponse(user)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserResponse> {
    this.validateId(id)
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User')
    }

    try {
      const updatedUser = await this.repository.update(id, data)
      return this.mapToResponse(updatedUser)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  private mapToResponse(user: User): UserResponse {
    const { password, ...userResponse } = user
    return userResponse
  }
}
