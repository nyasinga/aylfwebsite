import { User, UserRole } from '@prisma/client'

export type UserEntity = User

export interface CreateUserDTO {
  email: string
  name?: string
  password: string
  role?: UserRole
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  role?: UserRole
  avatar?: string
  isActive?: boolean
}

export interface UserResponse {
  id: string
  email: string
  name: string | null
  role: UserRole
  avatar: string | null
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithPassword extends UserResponse {
  password: string
}
