// Simple in-memory rate limiter (for production, consider Redis)
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 100 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = store[identifier]

  // Clean up expired entries
  if (record && record.resetTime < now) {
    delete store[identifier]
  }

  const currentRecord = store[identifier]

  if (!currentRecord) {
    // First request in window
    store[identifier] = {
      count: 1,
      resetTime: now + options.windowMs,
    }
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (currentRecord.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }

  // Increment count
  currentRecord.count++
  return {
    allowed: true,
    remaining: options.maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 60000) // Clean up every minute
}
