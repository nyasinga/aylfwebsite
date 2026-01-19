import { getMedia, createMedia } from '@/modules/media/controllers/media.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return getMedia(request)
}

export async function POST(request: NextRequest) {
  return createMedia(request)
}
