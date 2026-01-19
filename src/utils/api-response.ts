import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: 200 }
  )
}

export function errorResponse(
  error: string | Error,
  statusCode: number = 500
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status: statusCode }
  )
}

export function validationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      data: errors,
    },
    { status: 400 }
  )
}
