/**
 * Error Handling Utilities for Cradle API
 *
 * Provides consistent error handling and transformation
 * for both query and mutation errors.
 */

import type { ApiResponse } from '../cradle-api-client'

/**
 * Custom error class for Cradle API errors
 */
export class CradleApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'CradleApiError'
  }
}

/**
 * Transform an API response into an error if it failed
 */
export function throwIfError<T>(
  response: ApiResponse<T>,
  context?: string
): asserts response is ApiResponse<T> & { success: true } {
  if (!response.success) {
    const errorMessage = context
      ? `${context}: ${response.error || 'Unknown API error'}`
      : response.error || 'Unknown API error'
    throw new CradleApiError(errorMessage, undefined, response)
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): CradleApiError {
  if (error instanceof CradleApiError) {
    return error
  }

  if (error instanceof Error) {
    return new CradleApiError(error.message)
  }

  return new CradleApiError('An unknown error occurred')
}

/**
 * Check if an error is a CradleApiError
 */
export function isCradleApiError(error: unknown): error is CradleApiError {
  return error instanceof CradleApiError
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isCradleApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}

/**
 * Format error for user display
 */
export function formatErrorForUser(error: unknown): string {
  const message = getErrorMessage(error)

  // Capitalize first letter and ensure it ends with a period
  const formatted = message.charAt(0).toUpperCase() + message.slice(1)
  return formatted.endsWith('.') ? formatted : `${formatted}.`
}
