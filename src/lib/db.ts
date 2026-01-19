import { PrismaClient } from '@prisma/client'
import logger from './logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  })

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: { query: string; params: string; duration: number }) => {
    logger.debug('Database Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    })
  })
}

prisma.$on('error' as never, (e: { message: string; target?: string }) => {
  logger.error('Database Error', { message: e.message, target: e.target })
})

prisma.$on('warn' as never, (e: { message: string }) => {
  logger.warn('Database Warning', { message: e.message })
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
  logger.info('Database connection closed')
})

export default prisma
