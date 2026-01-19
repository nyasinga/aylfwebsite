import { Event, EventStatus, EventRegistration, RegistrationStatus } from '@prisma/client'

export type EventEntity = Event & {
  organizer: { id: string; name: string | null; email: string }
  registrations: EventRegistration[]
}

export interface CreateEventDTO {
  title: string
  slug: string
  description: string
  content?: string
  image?: string
  startDate: Date
  endDate?: Date
  location?: string
  address?: string
  isOnline?: boolean
  eventUrl?: string
  status?: EventStatus
  organizerId: string
}

export interface UpdateEventDTO {
  title?: string
  slug?: string
  description?: string
  content?: string
  image?: string
  startDate?: Date
  endDate?: Date
  location?: string
  address?: string
  isOnline?: boolean
  eventUrl?: string
  status?: EventStatus
}

export interface EventResponse {
  id: string
  title: string
  slug: string
  description: string
  content: string | null
  image: string | null
  startDate: Date
  endDate: Date | null
  location: string | null
  address: string | null
  isOnline: boolean
  eventUrl: string | null
  status: EventStatus
  organizer: { id: string; name: string | null; email: string }
  registrationsCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventRegistrationDTO {
  eventId: string
  name: string
  email: string
  phone?: string
  notes?: string
}

export interface EventRegistrationResponse {
  id: string
  eventId: string
  name: string
  email: string
  phone: string | null
  status: RegistrationStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
