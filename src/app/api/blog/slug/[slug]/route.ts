import { getBlogPostBySlug } from '@/modules/blog/controllers/blog.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  return getBlogPostBySlug(request, context)
}
