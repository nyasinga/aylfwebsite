# Authentication & Authorization System

## Overview

This project implements a comprehensive authentication and authorization system with role-based access control (RBAC).

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Editor, Contributor, Moderator, User)
- ✅ Permission-based policies
- ✅ Protected API routes
- ✅ Middleware for authentication and authorization

## Roles

### Admin
- Full access to all resources
- Can manage users, content, settings
- All permissions

### Editor
- Can create, edit, and publish content
- Can manage blog posts, events, pages
- Cannot manage users or settings

### Contributor
- Can create and edit own content
- Cannot publish content (requires Editor/Admin approval)
- Limited permissions

### Moderator
- Can moderate and publish content
- Cannot create new content
- Review and approval permissions

### User
- Read-only access
- Can view public content
- No write permissions

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Usage

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const { data } = await response.json()
const token = data.token

// Use token in requests
const protectedResponse = await fetch('/api/blog', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
```

## Protecting Routes

### Using withAuth wrapper

```typescript
import { withAuth, withAdmin, withEditor } from '@/lib/auth/with-auth'

// Require authentication
export const myHandler = withAuth(async (request, user) => {
  // user is available here
  return successResponse({ userId: user.userId })
})

// Require admin role
export const adminHandler = withAdmin(async (request, user) => {
  // Only admins can access
})

// Require editor or admin
export const editorHandler = withEditor(async (request, user) => {
  // Editors and admins can access
})

// Require specific permission
export const permissionHandler = withAuth(
  async (request, user) => {
    // Handler code
  },
  { permissions: ['blog.publish'] }
)
```

### Using middleware directly

```typescript
import { requireAuth, requireRole, requirePermission } from '@/lib/auth/middleware'

export const handler = createApiHandler(async (request) => {
  // Require authentication
  const user = requireAuth(request)
  
  // Require specific role
  const admin = requireRole(request, ['ADMIN'])
  
  // Require permission
  const editor = requirePermission(request, 'blog.publish')
})
```

## Permissions

Available permissions:
- `users.read`, `users.create`, `users.update`, `users.delete`
- `blog.read`, `blog.create`, `blog.update`, `blog.delete`, `blog.publish`
- `events.read`, `events.create`, `events.update`, `events.delete`
- `donations.read`, `donations.create`, `donations.update`
- `media.read`, `media.create`, `media.update`, `media.delete`
- `pages.read`, `pages.create`, `pages.update`, `pages.delete`, `pages.publish`
- `settings.read`, `settings.update`

## Policy System

```typescript
import { Policy } from '@/lib/auth/policies'

// Check permission
if (Policy.can(userRole, 'blog.publish')) {
  // User can publish
}

// Require permission (throws error if not allowed)
Policy.require(userRole, 'blog.publish')

// Get all permissions for role
const permissions = Policy.getPermissions('EDITOR')
```

## Environment Variables

Required in `.env`:
```env
JWT_SECRET=your-jwt-secret-key-min-32-characters
```

## Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- Token refresh mechanism
- Role-based access control
- Permission-based policies
- Protected API routes
- Error handling for unauthorized access
