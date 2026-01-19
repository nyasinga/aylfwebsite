import { PrismaClient, Event } from '@prisma/client'
import { BaseRepository } from '@/core/base/base-repository'
import { FindAllOptions } from '@/core/interfaces/repository.interface'
import { CreateEventDTO, UpdateEventDTO } from '../types/event.types'
import prisma from '@/lib/db'

export class EventRepository extends BaseRepository<Event, CreateEventDTO, UpdateEventDTO> {
  constructor() {
    super(prisma, 'Event')
  }

  async findById(id: string): Promise<Event | null> {
    try {
      return await this.prisma.event.findUnique({
        where: { id },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          registrations: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findById')
    }
  }

  async findBySlug(slug: string): Promise<Event | null> {
    try {
      return await this.prisma.event.findUnique({
        where: { slug },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          registrations: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'findBySlug')
    }
  }

  async findAll(options?: FindAllOptions): Promise<Event[]> {
    try {
      const { page = 1, limit = 10, orderBy, where } = options || {}
      const skip = (page - 1) * limit

      return await this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { startDate: 'asc' },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          _count: { select: { registrations: true } },
        },
      })
    } catch (error) {
      this.handleError(error, 'findAll')
    }
  }

  async create(data: CreateEventDTO): Promise<Event> {
    try {
      return await this.prisma.event.create({
        data,
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          registrations: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateEventDTO): Promise<Event> {
    try {
      return await this.prisma.event.update({
        where: { id },
        data,
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          registrations: true,
        },
      })
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.event.delete({
        where: { id },
      })
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async count(filter?: Partial<Event>): Promise<number> {
    try {
      return await this.prisma.event.count({
        where: filter,
      })
    } catch (error) {
      this.handleError(error, 'count')
    }
  }
}
