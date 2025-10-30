/**
 * Server-Side API Service
 *
 * Wrapper around CradleApiClient for server-side use.
 * Provides error handling, logging, and response transformation.
 *
 * This service is meant to be used in server actions and API routes.
 */

import { getCradleClient } from '../client'
import type { ApiResponse } from '../cradle-api-client'
import { CradleApiError, throwIfError } from '../utils/error-handlers'

/**
 * Execute a Cradle API call with error handling
 *
 * @template T - The expected response data type
 * @param operation - A function that performs the API call
 * @returns The API response data
 * @throws {CradleApiError} If the API call fails
 */
export async function executeCradleOperation<T>(
  operation: () => Promise<ApiResponse<T>>
): Promise<T> {
  try {
    const response = await operation()
    throwIfError(response)

    if (response.data === null) {
      throw new CradleApiError('API returned null data')
    }

    return response.data
  } catch (error) {
    // Log error for debugging (in production, this might go to your logging service)
    console.error('Cradle API operation failed:', error)

    // Re-throw as CradleApiError if not already
    if (error instanceof CradleApiError) {
      throw error
    }

    throw new CradleApiError(error instanceof Error ? error.message : 'Unknown error occurred')
  }
}

/**
 * Execute a Cradle API call that might return null without throwing
 *
 * @template T - The expected response data type
 * @param operation - A function that performs the API call
 * @returns The API response data or null
 */
export async function executeCradleOperationNullable<T>(
  operation: () => Promise<ApiResponse<T>>
): Promise<T | null> {
  try {
    const response = await operation()

    if (!response.success) {
      console.error('Cradle API operation failed:', response.error)
      return null
    }

    return response.data
  } catch (error) {
    console.error('Cradle API operation failed:', error)
    return null
  }
}

/**
 * Get the Cradle API client with automatic error handling
 */
export function getApiClient() {
  try {
    return getCradleClient()
  } catch (error) {
    throw new CradleApiError(
      'Failed to initialize Cradle API client. Check your environment variables.',
      500,
      error
    )
  }
}

/**
 * Service class for organized API operations
 * Can be extended for specific business logic
 */
export class CradleApiService {
  private client = getApiClient()

  /**
   * Execute an operation with the service client
   */
  protected async execute<T>(
    operation: (client: typeof this.client) => Promise<ApiResponse<T>>
  ): Promise<T> {
    return executeCradleOperation(() => operation(this.client))
  }

  /**
   * Execute an operation that might return null
   */
  protected async executeNullable<T>(
    operation: (client: typeof this.client) => Promise<ApiResponse<T>>
  ): Promise<T | null> {
    return executeCradleOperationNullable(() => operation(this.client))
  }
}
