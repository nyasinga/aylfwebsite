import { Donation, DonationStatus, PaymentMethod } from '@prisma/client'

export interface CreateDonationDTO {
  amount: number
  currency?: string
  donorName: string
  donorEmail: string
  donorPhone?: string
  isAnonymous?: boolean
  paymentMethod: PaymentMethod
  status?: DonationStatus
  transactionId?: string
  notes?: string
  userId?: string
}

export interface UpdateDonationDTO {
  status?: DonationStatus
  transactionId?: string
  notes?: string
}

export interface DonationResponse {
  id: string
  amount: number
  currency: string
  donorName: string
  donorEmail: string
  donorPhone: string | null
  isAnonymous: boolean
  paymentMethod: PaymentMethod
  status: DonationStatus
  transactionId: string | null
  notes: string | null
  user: { id: string; name: string | null; email: string } | null
  createdAt: Date
  updatedAt: Date
}
