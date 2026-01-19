import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, requirePermission, AuthUser } from './middleware'
import { UserRole } from '@prisma/client'
import { Permission } from './policies'

type AuthHandler = (
  request: NextRequest,
  user: AuthUser,
  context?: { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse

type AuthOptions = {
  roles?: UserRole[]
  permissions?: Permission[]
  requireAnyPermission?: boolean
}

/**
 * Wrapper for API routes that require authentication
 */
export function withAuth(
  handler: AuthHandler,
  options: AuthOptions = {}
): (request: NextRequest, context?: { params?: Record<string, string> }) => Promise<NextResponse> {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      let user: AuthUser

      // Check for role requirement
      if (options.roles && options.roles.length > 0) {
        user = requireRole(request, options.roles)
      }
      // Check for permission requirement
      else if (options.permissions && options.permissions.length > 0) {
        if (options.requireAnyPermission) {
          const { requireAnyPermission } = await import('./middleware')
          user = requireAnyPermission(request, options.permissions)
        } else {
          user = requirePermission(request, options.permissions[0])
        }
      }
      // Just require authentication
      else {
        user = requireAuth(request)
      }

      return await handler(request, user, context)
    } catch (error) {
      const { errorResponse } = await import('@/utils/api-response')
      if (error instanceof Error) {
        if (error.message.includes('Authentication required') || error.message.includes('Invalid')) {
          return errorResponse(error.message, 401)
        }
        if (error.message.includes('Access denied')) {
          return errorResponse(error.message, 403)
        }
      }
      return errorResponse('Unauthorized', 401)
    }
  }
}

/**
 * Require admin role
 */
export function withAdmin(handler: AuthHandler) {
  return withAuth(handler, { roles: ['ADMIN'] })
}

/**
 * Require editor or admin
 */
export function withEditor(handler: AuthHandler) {
  return withAuth(handler, { roles: ['ADMIN', 'EDITOR'] })
}

/**
 * Require contributor or higher
 */
export function withContributor(handler: AuthHandler) {
  return withAuth(handler, { roles: ['ADMIN', 'EDITOR', 'CONTRIBUTOR'] })
}
