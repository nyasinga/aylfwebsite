import { NextRequest, NextResponse } from 'next/server'
import { handleError } from './errors'
import logger from './logger'
import { errorResponse } from '@/utils/api-response'

type ApiHandler = (
  request: NextRequest,
  context?: { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse

export function createApiHandler(handler: ApiHandler) {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      return await handler(request, context)
    } catch (error) {
      const { message, statusCode, code } = handleError(error)
      logger.error('API Error', {
        path: request.nextUrl.pathname,
        method: request.method,
        error: message,
        code,
      })
      return errorResponse(message, statusCode)
    }
  }
}
