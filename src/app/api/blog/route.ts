import { getBlogPosts, createBlogPost } from '@/modules/blog/controllers/blog.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return getBlogPosts(request)
}

export async function POST(request: NextRequest) {
  return createBlogPost(request)
}
