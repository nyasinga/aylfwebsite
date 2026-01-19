# Architecture Documentation

## Clean Architecture with MVC Pattern

This project implements **Clean Architecture** principles with **MVC (Model-View-Controller)** pattern, ensuring separation of concerns, testability, and maintainability.

## Architecture Layers

### 1. **Models** (Prisma Schema)
- Located in `prisma/schema.prisma`
- Defines database structure and relationships
- Represents the data layer

### 2. **Views** (Next.js App Router)
- Located in `src/app/`
- React components and pages
- User interface layer

### 3. **Controllers** (API Route Handlers)
- Located in `src/modules/{module}/controllers/`
- Handle HTTP requests/responses
- Validate input, call services, return responses

### 4. **Services** (Business Logic)
- Located in `src/modules/{module}/services/`
- Contains business logic and orchestration
- Independent of data access implementation

### 5. **Repositories** (Data Access)
- Located in `src/modules/{module}/repositories/`
- Abstracts database operations
- Implements data access patterns

## Module Structure

Each feature module follows this structure:

```
modules/{module-name}/
├── controllers/     # API route handlers (MVC: Controller)
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── types/          # TypeScript type definitions
└── schemas/        # Zod validation schemas
```

## Modules

### 1. Users Module
**Purpose**: User management and authentication

**Models**: `User`, `UserRole`

**Endpoints**:
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### 2. Blog Module
**Purpose**: Blog posts, categories, and tags management

**Models**: `BlogPost`, `BlogCategory`, `BlogTag`, `PostStatus`

**Endpoints**:
- `GET /api/blog` - List blog posts
- `GET /api/blog/[id]` - Get post by ID
- `GET /api/blog/slug/[slug]` - Get post by slug
- `POST /api/blog` - Create post
- `PATCH /api/blog/[id]` - Update post
- `DELETE /api/blog/[id]` - Delete post

### 3. Events Module
**Purpose**: Event management and registrations

**Models**: `Event`, `EventRegistration`, `EventStatus`, `RegistrationStatus`

**Endpoints**:
- `GET /api/events` - List events
- `GET /api/events/[id]` - Get event by ID
- `POST /api/events` - Create event
- `PATCH /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### 4. Donations Module
**Purpose**: Donation management and tracking

**Models**: `Donation`, `DonationStatus`, `PaymentMethod`

**Endpoints**:
- `GET /api/donations` - List donations
- `GET /api/donations?stats=true` - Get donation statistics
- `GET /api/donations/[id]` - Get donation by ID
- `POST /api/donations` - Create donation

### 5. Media Module
**Purpose**: Media file management (images, videos, documents)

**Models**: `Media`, `MediaType`

**Endpoints**:
- `GET /api/media` - List media (filter by type)
- `GET /api/media/[id]` - Get media by ID
- `POST /api/media` - Upload/create media
- `PATCH /api/media/[id]` - Update media metadata
- `DELETE /api/media/[id]` - Delete media

### 6. Pages Module
**Purpose**: Static page management with hierarchy support

**Models**: `Page`

**Endpoints**:
- `GET /api/pages` - List pages
- `GET /api/pages?published=true` - Get published pages only
- `GET /api/pages/[id]` - Get page by ID
- `GET /api/pages/slug/[slug]` - Get page by slug
- `POST /api/pages` - Create page
- `PATCH /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

## Core Components

### Base Repository
- `src/core/base/base-repository.ts`
- Provides common CRUD operations
- All repositories extend this class

### Base Service
- `src/core/base/base-service.ts`
- Provides common business logic patterns
- All services extend this class

### Interfaces
- `src/core/interfaces/repository.interface.ts` - Repository contract
- `src/core/interfaces/service.interface.ts` - Service contract

## Data Flow

```
Request → Controller → Service → Repository → Database
                ↓
         Validation (Zod)
                ↓
         Error Handling
                ↓
         Response
```

## Key Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Single Responsibility**: Each class/function has one reason to change
4. **DRY (Don't Repeat Yourself)**: Common logic in base classes
5. **Type Safety**: Full TypeScript coverage with Zod validation

## Benefits

- ✅ **Testability**: Easy to mock repositories and services
- ✅ **Maintainability**: Clear structure and separation
- ✅ **Scalability**: Easy to add new modules
- ✅ **Type Safety**: End-to-end type checking
- ✅ **Reusability**: Base classes and utilities
- ✅ **Consistency**: Standardized patterns across modules

## Adding a New Module

1. Create module directory: `src/modules/{module-name}/`
2. Add Prisma model to `prisma/schema.prisma`
3. Create types in `types/`
4. Create validation schemas in `schemas/`
5. Implement repository in `repositories/`
6. Implement service in `services/`
7. Create controllers in `controllers/`
8. Add API routes in `src/app/api/{module-name}/`

## Example: Creating a New Module

```typescript
// 1. Repository
export class MyRepository extends BaseRepository<MyEntity, CreateDTO, UpdateDTO> {
  // Implement abstract methods
}

// 2. Service
export class MyService extends BaseService<MyResponse, CreateDTO, UpdateDTO> {
  private repository: MyRepository
  // Implement business logic
}

// 3. Controller
export const getItems = createApiHandler(async (request: NextRequest) => {
  const service = new MyService()
  const items = await service.getAll()
  return successResponse(items)
})
```

## Alignment with AYLF Website

Based on [aylfkenya.org](https://aylfkenya.org/), the modules support:

- **Programs**: Managed through Pages module (hierarchical structure)
- **Events**: Full event management with registrations
- **Blog/News**: Blog module with categories and tags
- **Gallery**: Media module for images and videos
- **Donations**: Complete donation tracking system
- **Contact**: Contact form submissions (existing Contact model)
