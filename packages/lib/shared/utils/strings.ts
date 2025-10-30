/**
 * String Converter to convert snake_case to Title Case
 * Eg.
 * - quick_brown_fox -> Quick Brown Fox
 * - quick_brown____fox -> Quick Brown Fox
 * - quick_brown_fox----jumps_over -> Quick Brown Fox Jumps Over
 *
 */

export const convertSnakeToTitleCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/^[-_]*(.)/, (_, c: string) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c: string) => ' ' + c.toUpperCase())

export function arrayToSentence(arr: string[]): string {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return arr.join(' and ')

  const lastElement = arr.pop()
  return arr.join(', ') + ', and ' + lastElement
}

export function isValidTwitterHandle(handle: string): string | true {
  if (!handle) return true
  const regex = /^@[A-Za-z0-9_]{1,15}$/
  return regex.test(handle) ? true : 'Invalid X / Twitter handle'
}

export function isValidTelegramHandle(handle: string): string | true {
  if (!handle) return true
  const regex = /^@[A-Za-z0-9_]{5,32}$/
  return regex.test(handle) ? true : 'Invalid Telegram handle'
}

export function hasWhitespace(s: string) {
  return /\s/g.test(s)
}

/**
 * Shorten an address or hash by showing only the first and last characters
 * Always includes '0x' prefix for blockchain addresses
 *
 * @param address - The full address/hash to shorten
 * @param startChars - Number of characters to show after '0x' (default: 4)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns Shortened address like "0x1234...5678"
 *
 * @example
 * shortenAddress("0x1234567890abcdef1234567890abcdef12345678") // "0x1234...5678"
 * shortenAddress("1234567890abcdef1234567890abcdef12345678") // "0x1234...5678"
 * shortenAddress("0x1234567890abcdef1234567890abcdef12345678", 6, 6) // "0x123456...345678"
 */
export function shortenAddress(
  address: string,
  startChars: number = 4,
  endChars: number = 4
): string {
  if (!address) return ''

  // Remove '0x' prefix if present for consistent handling
  const cleanAddress = address.toLowerCase().startsWith('0x') ? address.slice(2) : address

  // If address is too short, just add 0x prefix and return
  if (cleanAddress.length <= startChars + endChars) {
    return `0x${cleanAddress}`
  }

  // Return shortened format with 0x prefix
  return `0x${cleanAddress.slice(0, startChars)}...${cleanAddress.slice(-endChars)}`
}

/**
 * Copy text to clipboard using the modern Clipboard API with fallback
 *
 * @param text - The text to copy to clipboard
 * @returns Promise<boolean> - True if successful, false otherwise
 *
 * @example
 * await copyToClipboard("0x1234567890abcdef")
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const success = document.execCommand('copy')
    textArea.remove()

    return success
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
