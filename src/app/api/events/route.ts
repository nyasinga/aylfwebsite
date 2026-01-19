import { getEvents, createEvent } from '@/modules/events/controllers/event.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return getEvents(request)
}

export async function POST(request: NextRequest) {
  return createEvent(request)
}
