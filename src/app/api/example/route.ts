import { NextRequest } from 'next/server'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse } from '@/utils/api-response'
import { rateLimit } from '@/lib/rate-limit'
import { paginationSchema } from '@/lib/validation'

/**
 * Example API route demonstrating best practices:
 * - Error handling with createApiHandler
 * - Rate limiting
 * - Request validation
 * - Proper response formatting
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  // Rate limiting
  const clientId = request.headers.get('x-forwarded-for') || 'unknown'
  const limit = rateLimit(clientId, { windowMs: 60000, maxRequests: 10 })

  if (!limit.allowed) {
    return errorResponse('Too many requests', 429)
  }

  // Parse and validate query parameters
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const validation = paginationSchema.safeParse(params)
  if (!validation.success) {
    return errorResponse('Invalid query parameters', 400)
  }

  const { page, limit: limitValue } = validation.data

  // Example response
  return successResponse(
    {
      message: 'This is an example API route',
      pagination: {
        page,
        limit: limitValue,
        total: 100,
        totalPages: 10,
      },
      rateLimit: {
        remaining: limit.remaining,
        resetTime: new Date(limit.resetTime).toISOString(),
      },
    },
    'Example data retrieved successfully'
  )
})
