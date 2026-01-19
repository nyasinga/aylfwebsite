import { getDonations, createDonation, getDonationStats } from '@/modules/donations/controllers/donation.controller'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('stats') === 'true') {
    return getDonationStats(request)
  }
  return getDonations(request)
}

export async function POST(request: NextRequest) {
  return createDonation(request)
}
