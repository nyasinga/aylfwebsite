import { getUserById, updateUser, deleteUser } from '@/modules/users/controllers/user.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return getUserById(request, context)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateUser(request, context)
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteUser(request, context)
}
