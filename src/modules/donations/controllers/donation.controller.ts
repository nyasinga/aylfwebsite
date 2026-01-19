import { NextRequest } from 'next/server'
import { DonationService } from '../services/donation.service'
import { createApiHandler } from '@/lib/api-handler'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api-response'
import { paginationSchema } from '@/lib/validation'
import { z } from 'zod'

const donationService = new DonationService()

const createDonationSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  donorName: z.string().min(2).max(100),
  donorEmail: z.string().email(),
  donorPhone: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  paymentMethod: z.enum([
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'PAYPAL',
    'STRIPE',
    'MOBILE_MONEY',
    'CASH',
    'OTHER',
  ]),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().cuid().optional(),
})

export const getDonations = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const pagination = paginationSchema.safeParse(params)
  if (!pagination.success) {
    return validationErrorResponse(pagination.error.flatten().fieldErrors)
  }

  const status = searchParams.get('status')

  const donations = await donationService.getAll({
    page: pagination.data.page,
    limit: pagination.data.limit,
    filter: status ? { status } : undefined,
  })

  return successResponse(donations, 'Donations retrieved successfully')
})

export const getDonationById = createApiHandler(async (request: NextRequest, context) => {
  const { id } = context?.params || {}
  if (!id) {
    return errorResponse('Donation ID is required', 400)
  }

  const donation = await donationService.getById(id)
  return successResponse(donation, 'Donation retrieved successfully')
})

export const createDonation = createApiHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = createDonationSchema.safeParse(body)

  if (!validation.success) {
    return validationErrorResponse(validation.error.flatten().fieldErrors)
  }

  const donation = await donationService.create(validation.data)
  return successResponse(donation, 'Donation created successfully', 201)
})

export const getDonationStats = createApiHandler(async () => {
  const totalAmount = await donationService.getTotalAmount()
  return successResponse({ totalAmount }, 'Donation statistics retrieved successfully')
})
