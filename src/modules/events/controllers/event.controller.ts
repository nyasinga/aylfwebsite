import { NextRequest } from 'next/server'
import { EventService } from '../services/event.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { paginationSchema } from '@/lib/validation'
import { z } from 'zod'

const eventService = new EventService()

const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10),
  content: z.string().optional(),
  image: z.string().url().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  location: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  isOnline: z.boolean().optional(),
  eventUrl: z.string().url().optional().nullable(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  organizerId: z.string().cuid(),
})

const updateEventSchema = createEventSchema.partial()

export const getEvents = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const status = searchParams.get('status')

  const events = await eventService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
    filter: status ? { status } : undefined,
  })

  return successResponse(events, 'Events retrieved successfully')
})

export const getEventById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Event ID is required', 400)
  }

  const event = await eventService.getById(id)
  return successResponse(event, 'Event retrieved successfully')
})

export const createEvent = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = createEventSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const event = await eventService.create({
    ...validation.data,
    startDate: new Date(validation.data.startDate),
    endDate: validation.data.endDate ? new Date(validation.data.endDate) : undefined,
  })
  return successResponse(event, 'Event created successfully', 201)
})

export const updateEvent = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Event ID is required', 400)
  }

  const body = await request.json()
  const validation = updateEventSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const event = await eventService.update(id, {
    ...validation.data,
    startDate: validation.data.startDate ? new Date(validation.data.startDate) : undefined,
    endDate: validation.data.endDate ? new Date(validation.data.endDate) : undefined,
  })
  return successResponse(event, 'Event updated successfully')
})

export const deleteEvent = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Event ID is required', 400)
  }

  await eventService.delete(id)
  return successResponse(null, 'Event deleted successfully')
})
