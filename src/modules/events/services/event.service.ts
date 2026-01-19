import { Event } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { EventRepository } from '../repositories/event.repository'
import {
  CreateEventDTO,
  UpdateEventDTO,
  EventResponse,
  EventEntity,
  CreateEventRegistrationDTO,
  EventRegistrationResponse,
} from '../types/event.types'
import { NotFoundError } from '@/lib/errors'
import prisma from '@/lib/db'

export class EventService extends BaseService<EventResponse, CreateEventDTO, UpdateEventDTO> {
  private repository: EventRepository

  constructor() {
    super('EventService')
    this.repository = new EventRepository()
  }

  async getById(id: string): Promise<EventResponse> {
    this.validateId(id)
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundError('Event')
    }
    return this.mapToResponse(event as EventEntity)
  }

  async getBySlug(slug: string): Promise<EventResponse> {
    const event = await this.repository.findBySlug(slug)
    if (!event) {
      throw new NotFoundError('Event')
    }
    return this.mapToResponse(event as EventEntity)
  }

  async getAll(options?: ServiceOptions): Promise<EventResponse[]> {
    try {
      const events = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return events.map((event) => this.mapToResponse(event as any))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async create(data: CreateEventDTO): Promise<EventResponse> {
    try {
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Event with this slug already exists')
      }

      const event = await this.repository.create(data)
      return this.mapToResponse(event as EventEntity)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateEventDTO): Promise<EventResponse> {
    this.validateId(id)
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundError('Event')
    }

    if (data.slug && data.slug !== event.slug) {
      const existing = await this.repository.findBySlug(data.slug)
      if (existing) {
        throw new Error('Event with this slug already exists')
      }
    }

    try {
      const updatedEvent = await this.repository.update(id, data)
      return this.mapToResponse(updatedEvent as EventEntity)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundError('Event')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async register(data: CreateEventRegistrationDTO): Promise<EventRegistrationResponse> {
    const event = await this.repository.findById(data.eventId)
    if (!event) {
      throw new NotFoundError('Event')
    }

    try {
      const registration = await prisma.eventRegistration.create({
        data,
      })
      return registration as EventRegistrationResponse
    } catch (error) {
      this.handleError(error, 'register')
    }
  }

  private mapToResponse(event: EventEntity): EventResponse {
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      content: event.content,
      image: event.image,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      address: event.address,
      isOnline: event.isOnline,
      eventUrl: event.eventUrl,
      status: event.status,
      organizer: event.organizer,
      registrationsCount: event.registrations?.length || 0,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }
  }
}
