import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'
import { Policy, Permission } from './policies'
import { UnauthorizedError, ForbiddenError } from '../errors'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  userId: string
  email: string
  role: UserRole
}

/**
 * Extract token from request headers
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

/**
 * Get authenticated user from request
 */
export function getAuthUser(request: NextRequest): AuthUser {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    throw new UnauthorizedError('Authentication required')
  }

  try {
    const payload = verifyToken(token)
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    }
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

/**
 * Require authentication middleware
 */
export function requireAuth(request: NextRequest): AuthUser {
  return getAuthUser(request)
}

/**
 * Require specific role middleware
 */
export function requireRole(request: NextRequest, roles: UserRole[]): AuthUser {
  const user = requireAuth(request)
  
  if (!roles.includes(user.role)) {
    throw new ForbiddenError(`Access denied. Required roles: ${roles.join(', ')}`)
  }
  
  return user
}

/**
 * Require permission middleware
 */
export function requirePermission(request: NextRequest, permission: Permission): AuthUser {
  const user = requireAuth(request)
  
  if (!Policy.hasPermission(user.role, permission)) {
    throw new ForbiddenError(`Access denied. Required permission: ${permission}`)
  }
  
  return user
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(request: NextRequest, permissions: Permission[]): AuthUser {
  const user = requireAuth(request)
  
  if (!Policy.hasAnyPermission(user.role, permissions)) {
    throw new ForbiddenError(`Access denied. Required one of: ${permissions.join(', ')}`)
  }
  
  return user
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export function optionalAuth(request: NextRequest): AuthUser | null {
  try {
    return getAuthUser(request)
  } catch {
    return null
  }
}
