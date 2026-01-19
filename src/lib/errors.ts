import logger from './logger'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export function handleError(error: unknown): {
  message: string
  statusCode: number
  code?: string
} {
  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error('Non-operational error', { error: error.message, stack: error.stack })
    }
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    }
  }

  // Unknown error
  logger.error('Unknown error', { error })
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    code: 'INTERNAL_ERROR',
  }
}
