import { me } from '@/modules/auth/controllers/auth.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return me(request)
}
