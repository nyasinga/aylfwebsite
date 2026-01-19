import { getDonationById } from '@/modules/donations/controllers/donation.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getDonationById(request, context)
}
