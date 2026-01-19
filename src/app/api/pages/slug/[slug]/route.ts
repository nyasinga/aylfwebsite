import { getPageBySlug } from '@/modules/pages/controllers/page.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  return getPageBySlug(request, context)
}
