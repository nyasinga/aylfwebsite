import { login } from '@/modules/auth/controllers/auth.controller'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return login(request)
}
