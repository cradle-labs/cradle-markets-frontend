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
