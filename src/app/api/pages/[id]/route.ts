import { getPageById, updatePage, deletePage } from '@/modules/pages/controllers/page.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getPageById(request, context)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updatePage(request, context)
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deletePage(request, context)
}
