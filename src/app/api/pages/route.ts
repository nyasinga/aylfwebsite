import { getPages, createPage } from '@/modules/pages/controllers/page.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return getPages(request)
}

export async function POST(request: NextRequest) {
  return createPage(request)
}
