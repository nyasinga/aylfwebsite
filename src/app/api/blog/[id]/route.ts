import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/modules/blog/controllers/blog.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getBlogPostById(request, context)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateBlogPost(request, context)
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteBlogPost(request, context)
}
