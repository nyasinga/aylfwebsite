# AYLF Website

A production-ready NGO website built with Next.js 14, TypeScript, and modern best practices.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Prisma ORM** with PostgreSQL
- ✅ **Winston** for structured logging
- ✅ **Environment variables** with validation
- ✅ **Security middleware** with headers
- ✅ **Application key encryption**
- ✅ **Scalable project structure**
- ✅ **ESLint & Prettier** configured

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Git

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following required variables:

```env
# Application Configuration
APP_NAME=AYLF Website
APP_URL=http://localhost:3000
NODE_ENV=development

# Application Security (IMPORTANT: Change these in production!)
APP_KEY=your-secret-key-change-this-in-production-min-32-characters
JWT_SECRET=your-jwt-secret-key-change-this-in-production
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/aylf_db?schema=public

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

**Security Note**: Generate strong random keys for production:

```bash
# Generate secure keys (32+ characters)
openssl rand -hex 32
```

### 3. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE aylf_db;
```

2. Generate Prisma Client:

```bash
npm run db:generate
```

3. Push the schema to your database:

```bash
npm run db:push
```

Or run migrations:

```bash
npm run db:migrate
```

4. (Optional) Open Prisma Studio to view your data:

```bash
npm run db:studio
```

### 4. Create Logs Directory

```bash
mkdir -p logs
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

The project follows **Clean Architecture** with **MVC (Model-View-Controller)** pattern:

```text
aylfwebsite/
├── prisma/
│   └── schema.prisma          # Database schema (Models)
├── src/
│   ├── app/                   # Next.js App Router (Views)
│   │   ├── api/              # API routes (Controllers)
│   │   │   ├── users/        # User endpoints
│   │   │   ├── blog/         # Blog endpoints
│   │   │   ├── events/       # Event endpoints
│   │   │   ├── donations/    # Donation endpoints
│   │   │   ├── media/        # Media endpoints
│   │   │   ├── pages/        # Page endpoints
│   │   │   └── health/       # Health check endpoint
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── core/                 # Core architecture
│   │   ├── interfaces/       # Base interfaces
│   │   │   ├── repository.interface.ts
│   │   │   └── service.interface.ts
│   │   └── base/            # Base classes
│   │       ├── base-repository.ts
│   │       └── base-service.ts
│   ├── modules/              # Feature modules (MVC)
│   │   ├── users/           # Users module
│   │   │   ├── controllers/ # Controllers (API handlers)
│   │   │   ├── services/    # Services (Business logic)
│   │   │   ├── repositories/# Repositories (Data access)
│   │   │   ├── types/       # Type definitions
│   │   │   └── schemas/     # Validation schemas
│   │   ├── blog/            # Blog module
│   │   ├── events/          # Events module
│   │   ├── donations/       # Donations module
│   │   ├── media/           # Media module
│   │   └── pages/           # Pages module
│   ├── components/          # React components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core utilities
│   │   ├── db.ts          # Database client
│   │   ├── env.ts         # Environment validation
│   │   ├── logger.ts      # Logging configuration
│   │   ├── security.ts    # Security utilities
│   │   ├── errors.ts      # Error classes
│   │   ├── api-handler.ts # API handler wrapper
│   │   └── constants.ts   # Application constants
│   ├── middleware.ts       # Next.js middleware
│   ├── types/             # Global TypeScript types
│   └── utils/             # Helper functions
│       └── api-response.ts # API response utilities
├── .env.example           # Environment variables template
├── .eslintrc.json        # ESLint configuration
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

### Required

- `APP_NAME` - Application name
- `APP_URL` - Application URL
- `NODE_ENV` - Environment (development/production/test)
- `APP_KEY` - Application encryption key (min 32 characters)
- `JWT_SECRET` - JWT secret key (min 32 characters)
- `SESSION_SECRET` - Session secret key (min 32 characters)
- `DATABASE_URL` - PostgreSQL connection string
- `LOG_LEVEL` - Logging level (error/warn/info/debug)
- `LOG_FILE_PATH` - Path to log file

### Optional

- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM` - Default sender email
- `GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `RECAPTCHA_SITE_KEY` - reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key

## Security Features

- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- **Application Key Encryption**: AES-256-GCM encryption for sensitive data
- **Environment Validation**: Zod schema validation for all environment variables
- **Secure Password Hashing**: bcryptjs for password hashing
- **Database Query Logging**: Development-only query logging

## Logging

Logs are written to:

- Console (development)
- `logs/app.log` (all logs)
- `logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## Database

The project uses Prisma ORM with PostgreSQL. Example models are included:

- `User` - User accounts with roles
- `Contact` - Contact form submissions

## API Routes

### Core
- `GET /api/health` - Health check endpoint (checks database connection)

### Users Module

- `GET /api/users` - List all users (with pagination)
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Blog Module

- `GET /api/blog` - List blog posts (with pagination, filter by status/category)
- `GET /api/blog/[id]` - Get blog post by ID
- `GET /api/blog/slug/[slug]` - Get blog post by slug (increments views)
- `POST /api/blog` - Create blog post
- `PATCH /api/blog/[id]` - Update blog post
- `DELETE /api/blog/[id]` - Delete blog post

### Events Module

- `GET /api/events` - List events (with pagination, filter by status)
- `GET /api/events/[id]` - Get event by ID
- `POST /api/events` - Create event
- `PATCH /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Donations Module

- `GET /api/donations` - List donations (with pagination, filter by status)
- `GET /api/donations?stats=true` - Get donation statistics (total amount)
- `GET /api/donations/[id]` - Get donation by ID
- `POST /api/donations` - Create donation

### Media Module

- `GET /api/media` - List media files (with pagination, filter by type)
- `GET /api/media/[id]` - Get media by ID
- `POST /api/media` - Upload/create media
- `PATCH /api/media/[id]` - Update media metadata
- `DELETE /api/media/[id]` - Delete media

### Pages Module

- `GET /api/pages` - List pages (with pagination)
- `GET /api/pages?published=true` - Get published pages only
- `GET /api/pages/[id]` - Get page by ID
- `GET /api/pages/slug/[slug]` - Get page by slug
- `POST /api/pages` - Create page
- `PATCH /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

## Architecture

This project implements **Clean Architecture** with **MVC (Model-View-Controller)** pattern:

- **Models**: Prisma schema defines database structure
- **Views**: Next.js App Router pages and components
- **Controllers**: API route handlers in `src/modules/{module}/controllers/`
- **Services**: Business logic in `src/modules/{module}/services/`
- **Repositories**: Data access layer in `src/modules/{module}/repositories/`

Each module (Users, Blog, Events, Donations, Media, Pages) follows this structure for maintainability and scalability.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Best Practices Implemented

- ✅ **Clean Architecture** with MVC pattern
- ✅ **Separation of Concerns** (Controllers, Services, Repositories)
- ✅ **TypeScript** for type safety
- ✅ **Zod** for runtime validation
- ✅ **Environment variable** validation
- ✅ **Structured logging** with Winston
- ✅ **Security middleware** with headers
- ✅ **Database connection** pooling
- ✅ **Error handling** utilities
- ✅ **Scalable folder** structure
- ✅ **Code formatting** (Prettier)
- ✅ **Linting** (ESLint)
- ✅ **Component-based** architecture
- ✅ **Base classes** for reusability

## Production Deployment

1. Set `NODE_ENV=production`
2. Generate secure keys for `APP_KEY`, `JWT_SECRET`, and `SESSION_SECRET`
3. Configure production database URL
4. Set up proper logging (consider external logging service)
5. Configure domain and SSL certificates
6. Set up environment variables in your hosting platform
7. Run `npm run build` to create production build
8. Run `npm run start` to start production server

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Run `npm run lint` before committing
4. Write meaningful commit messages
5. Test your changes thoroughly

## License

[Add your license here]

## Support

For issues and questions, please contact [your contact information].
Build a dynamic homepage with:
- Hero section (editable from admin)
- Impact metrics
- Featured blog posts
- Upcoming events
- Call-to-action buttons
Use database-driven content.
