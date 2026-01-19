import { getMediaById, updateMedia, deleteMedia } from '@/modules/media/controllers/media.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getMediaById(request, context)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateMedia(request, context)
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteMedia(request, context)
}
