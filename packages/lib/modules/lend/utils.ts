/**
 * Lending Pool Utilities
 *
 * Helper functions for working with lending pool data
 *
 * ## Basis Points Conversion
 *
 * For accuracy in mathematical operations, all pool config values are represented
 * with basis points of 10,000. That means some values will come in as multiples
 * of this basis point value. For example, 0.95 (95%) will come in as 9500.
 *
 * ### Values that need conversion from basis points:
 *
 * **From LendingPool:**
 * - loan_to_value
 * - base_rate
 * - slope1
 * - slope2
 * - liquidation_threshold
 * - liquidation_discount
 * - reserve_factor
 *
 * **From LendingPoolSnapshot:**
 * - utilization_rate
 * - supply_apy
 * - borrow_apy
 *
 * **From InterestRates (if used):**
 * - base_rate
 * - slope1
 * - slope2
 * - reserve_factor
 *
 * **From CollateralInfo (if used):**
 * - loan_to_value
 * - liquidation_threshold
 * - liquidation_discount
 *
 * Use `fromBasisPoints()` to convert these values before displaying them to users
 * or using them in calculations.
 */

/**
 * Convert basis points to decimal value
 * Pool config values are represented with base points of 10000
 * E.g., 9500 basis points = 0.95
 *
 * @param value - The value in basis points (as string or number)
 * @returns The decimal value
 *
 * @example
 * ```ts
 * fromBasisPoints('9500') // 0.95
 * fromBasisPoints(5000) // 0.5
 * fromBasisPoints('100') // 0.01
 * ```
 */
export function fromBasisPoints(value: string | number): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return numValue / 10000
}

/**
 * Convert decimal value to basis points
 * Inverse of fromBasisPoints
 *
 * @param value - The decimal value
 * @returns The value in basis points
 *
 * @example
 * ```ts
 * toBasisPoints(0.95) // 9500
 * toBasisPoints(0.5) // 5000
 * toBasisPoints(0.01) // 100
 * ```
 */
export function toBasisPoints(value: number): number {
  return value * 10000
}

/**
 * Format a basis point value as a percentage string
 *
 * @param value - The value in basis points (as string or number)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatBasisPointsAsPercent('9500') // '95.00%'
 * formatBasisPointsAsPercent(5000, 0) // '50%'
 * formatBasisPointsAsPercent('100', 3) // '1.000%'
 * ```
 */
export function formatBasisPointsAsPercent(value: string | number, decimals: number = 2): string {
  const decimalValue = fromBasisPoints(value)
  return `${(decimalValue * 100).toFixed(decimals)}%`
}

/**
 * Token Decimal Conversion
 *
 * Demo tokens have 8 decimals. This means 1 token is represented as 1 * 10^8 = 100000000
 * in the backend. Users should enter normalized values (like "1.5") which need to be
 * converted to the decimal form before submission.
 */

/**
 * Number of decimals for demo tokens
 */
export const TOKEN_DECIMALS = 8

/**
 * Convert normalized token amount to decimal form for backend submission
 * Users enter "1.5" tokens, backend needs "150000000" (1.5 * 10^8)
 *
 * @param amount - The normalized amount entered by user
 * @param decimals - Number of decimals (default: 8)
 * @returns The amount in decimal form
 *
 * @example
 * ```ts
 * toTokenDecimals(1.5) // 150000000
 * toTokenDecimals(10) // 1000000000
 * toTokenDecimals(0.01) // 1000000
 * ```
 */
export function toTokenDecimals(amount: number, decimals: number = TOKEN_DECIMALS): number {
  return Math.floor(amount * Math.pow(10, decimals))
}

/**
 * Convert decimal form amount from backend to normalized form for display
 * Backend sends "150000000", display to user as "1.5"
 *
 * @param amount - The amount in decimal form from backend
 * @param decimals - Number of decimals (default: 8)
 * @returns The normalized amount for display
 *
 * @example
 * ```ts
 * fromTokenDecimals(150000000) // 1.5
 * fromTokenDecimals(1000000000) // 10
 * fromTokenDecimals(1000000) // 0.01
 * ```
 */
export function fromTokenDecimals(amount: number, decimals: number = TOKEN_DECIMALS): number {
  return amount / Math.pow(10, decimals)
}

/**
 * Format token amount with proper decimal handling
 *
 * @param amount - The amount in decimal form from backend
 * @param decimals - Number of decimals (default: 8)
 * @param displayDecimals - Number of decimals to show (default: 2)
 * @returns Formatted token amount string
 *
 * @example
 * ```ts
 * formatTokenAmount(150000000) // '1.50'
 * formatTokenAmount(1000000000, 8, 0) // '10'
 * formatTokenAmount(1234567, 8, 4) // '0.0123'
 * ```
 */
export function formatTokenAmount(
  amount: number,
  decimals: number = TOKEN_DECIMALS,
  displayDecimals: number = 2
): string {
  const normalized = fromTokenDecimals(amount, decimals)
  return normalized.toFixed(displayDecimals)
}
