import { PrismaClient, User } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreateUserDTO, UpdateUserDTO } from '../types/user.types'
import prisma from '@/lib/db'

export class UserRepository extends BaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  constructor() {
    super(prisma, 'User')
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      })
    } catch (error) {
      this.handleError(error, 'findByEmail')
    }
  }

  async findAll(options?: FindAllOptions): Promise<User[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async create(data: CreateUserDTO): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<User>): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }
}
