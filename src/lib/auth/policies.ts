import { UserRole } from '@prisma/client'

export type Permission = 
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'blog.read'
  | 'blog.create'
  | 'blog.update'
  | 'blog.delete'
  | 'blog.publish'
  | 'events.read'
  | 'events.create'
  | 'events.update'
  | 'events.delete'
  | 'donations.read'
  | 'donations.create'
  | 'donations.update'
  | 'media.read'
  | 'media.create'
  | 'media.update'
  | 'media.delete'
  | 'pages.read'
  | 'pages.create'
  | 'pages.update'
  | 'pages.delete'
  | 'pages.publish'
  | 'settings.read'
  | 'settings.update'

// Role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Full access to everything
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'blog.read',
    'blog.create',
    'blog.update',
    'blog.delete',
    'blog.publish',
    'events.read',
    'events.create',
    'events.update',
    'events.delete',
    'donations.read',
    'donations.create',
    'donations.update',
    'media.read',
    'media.create',
    'media.update',
    'media.delete',
    'pages.read',
    'pages.create',
    'pages.update',
    'pages.delete',
    'pages.publish',
    'settings.read',
    'settings.update',
  ],
  EDITOR: [
    // Can create, edit, and publish content
    'blog.read',
    'blog.create',
    'blog.update',
    'blog.publish',
    'events.read',
    'events.create',
    'events.update',
    'pages.read',
    'pages.create',
    'pages.update',
    'pages.publish',
    'media.read',
    'media.create',
    'media.update',
    'donations.read',
  ],
  CONTRIBUTOR: [
    // Can create and edit own content, but cannot publish
    'blog.read',
    'blog.create',
    'blog.update',
    'events.read',
    'events.create',
    'events.update',
    'pages.read',
    'pages.create',
    'pages.update',
    'media.read',
    'media.create',
    'media.update',
    'donations.read',
  ],
  MODERATOR: [
    // Can moderate content
    'blog.read',
    'blog.update',
    'blog.publish',
    'events.read',
    'events.update',
    'pages.read',
    'pages.update',
    'pages.publish',
    'media.read',
    'donations.read',
  ],
  USER: [
    // Read-only access
    'blog.read',
    'events.read',
    'pages.read',
    'media.read',
  ],
}

export class Policy {
  /**
   * Check if a role has a specific permission
   */
  static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = rolePermissions[role] || []
    return permissions.includes(permission)
  }

  /**
   * Check if a role has any of the specified permissions
   */
  static hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(role, permission))
  }

  /**
   * Check if a role has all of the specified permissions
   */
  static hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(role, permission))
  }

  /**
   * Get all permissions for a role
   */
  static getPermissions(role: UserRole): Permission[] {
    return rolePermissions[role] || []
  }

  /**
   * Check if user can perform action on resource
   */
  static can(userRole: UserRole, action: Permission): boolean {
    return this.hasPermission(userRole, action)
  }

  /**
   * Require permission - throws error if not allowed
   */
  static require(userRole: UserRole, permission: Permission): void {
    if (!this.hasPermission(userRole, permission)) {
      throw new Error(`Access denied. Required permission: ${permission}`)
    }
  }
}
