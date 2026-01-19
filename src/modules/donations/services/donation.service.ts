import { Donation } from '@prisma/client'
import { BaseService } from '@/core/base/base-service'
import { ServiceOptions } from '@/core/interfaces/service.interface'
import { DonationRepository } from '../repositories/donation.repository'
import { CreateDonationDTO, UpdateDonationDTO, DonationResponse } from '../types/donation.types'
import { NotFoundError } from '@/lib/errors'

export class DonationService extends BaseService<
  DonationResponse,
  CreateDonationDTO,
  UpdateDonationDTO
> {
  private repository: DonationRepository

  constructor() {
    super('DonationService')
    this.repository = new DonationRepository()
  }

  async getById(id: string): Promise<DonationResponse> {
    this.validateId(id)
    const donation = await this.repository.findById(id)
    if (!donation) {
      throw new NotFoundError('Donation')
    }
    return this.mapToResponse(donation)
  }

  async getAll(options?: ServiceOptions): Promise<DonationResponse[]> {
    try {
      const donations = await this.repository.findAll({
        page: options?.page,
        limit: options?.limit,
        orderBy: options?.orderBy,
        where: options?.filter,
      })
      return donations.map((donation) => this.mapToResponse(donation))
    } catch (error) {
      this.handleError(error, 'getAll')
    }
  }

  async create(data: CreateDonationDTO): Promise<DonationResponse> {
    try {
      const donation = await this.repository.create(data)
      return this.mapToResponse(donation)
    } catch (error) {
      this.handleError(error, 'create')
    }
  }

  async update(id: string, data: UpdateDonationDTO): Promise<DonationResponse> {
    this.validateId(id)
    const donation = await this.repository.findById(id)
    if (!donation) {
      throw new NotFoundError('Donation')
    }

    try {
      const updatedDonation = await this.repository.update(id, data)
      return this.mapToResponse(updatedDonation)
    } catch (error) {
      this.handleError(error, 'update')
    }
  }

  async delete(id: string): Promise<void> {
    this.validateId(id)
    const donation = await this.repository.findById(id)
    if (!donation) {
      throw new NotFoundError('Donation')
    }

    try {
      await this.repository.delete(id)
    } catch (error) {
      this.handleError(error, 'delete')
    }
  }

  async getTotalAmount(): Promise<number> {
    try {
      return await this.repository.getTotalAmount()
    } catch (error) {
      this.handleError(error, 'getTotalAmount')
    }
  }

  private mapToResponse(donation: Donation & { user?: any }): DonationResponse {
    return {
      id: donation.id,
      amount: Number(donation.amount),
      currency: donation.currency,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      isAnonymous: donation.isAnonymous,
      paymentMethod: donation.paymentMethod,
      status: donation.status,
      transactionId: donation.transactionId,
      notes: donation.notes,
      user: donation.user || null,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
    }
  }
}
