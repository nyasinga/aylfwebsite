import { UserService } from '@/modules/users/services/user.service'
import { UserRepository } from '@/modules/users/repositories/user.repository'
import { signToken } from '@/lib/auth/jwt'
import { UnauthorizedError } from '@/lib/errors'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    role: UserRole
    avatar: string | null
  }
  token: string
}

export class AuthService {
  private userService: UserService
  private userRepository: UserRepository

  constructor() {
    this.userService = new UserService()
    this.userRepository = new UserRepository()
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email)
    
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive')
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLogin: new Date(),
    })

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    }
  }

  async register(data: RegisterDTO, role: UserRole = 'USER'): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create user
    const user = await this.userService.create({
      email: data.email,
      password: data.password,
      name: data.name,
      role,
    })

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    }
  }

  async refreshToken(userId: string): Promise<string> {
    const user = await this.userRepository.findById(userId)
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive')
    }

    return signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
  }
}
