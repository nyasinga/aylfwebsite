import { PrismaClient, Donation } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreateDonationDTO, UpdateDonationDTO } from '../types/donation.types'
import prisma from '@/lib/db'

export class DonationRepository extends BaseRepository<
  Donation,
  CreateDonationDTO,
  UpdateDonationDTO
> {
  constructor() {
    super(prisma, 'Donation')
  }

  async findById(id: string): Promise<Donation | null> {
    try {
      return await this.prisma.donation.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findAll(options?: FindAllOptions): Promise<Donation[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async create(data: CreateDonationDTO): Promise<Donation> {
    try {
      return await this.prisma.donation.create({
        data: {
          ...data,
          amount: data.amount,
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateDonationDTO): Promise<Donation> {
    try {
      return await this.prisma.donation.update({
        where: { id },
        data,
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.donation.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<Donation>): Promise<number> {
    try {
      return await this.prisma.donation.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }

  async getTotalAmount(filter?: Partial<Donation>): Promise<number> {
    try {
      const result = await this.prisma.donation.aggregate({
        where: {
          ...filter,
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      })
      return Number(result._sum.amount || 0)
    } catch (error) {
      this.handleError(error, 'getTotalAmount')
    }
  }
}
