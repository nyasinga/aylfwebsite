import { getEventById, updateEvent, deleteEvent } from '@/modules/events/controllers/event.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getEventById(request, context)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateEvent(request, context)
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteEvent(request, context)
}
