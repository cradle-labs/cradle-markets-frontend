import type { SVGProps } from 'react'

export function TokenBrandedBinance(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Icon from Web3 Icons Branded by 0xa3k5 - https://github.com/0xa3k5/web3icons/blob/main/LICENCE */}
      <path
        d="m7.068 12l-2.03 2.03L3.003 12l2.03-2.03zm4.935-4.935l3.482 3.483l2.03-2.03L12.003 3L6.485 8.518l2.03 2.03zm6.964 2.905L16.937 12l2.03 2.03l2.03-2.03zm-6.964 6.965L8.52 13.452l-2.03 2.03L12.003 21l5.512-5.518l-2.03-2.03zm0-2.905l2.03-2.03l-2.03-2.03L9.967 12z"
        fill="#F0B90B"
      />
    </svg>
  )
}

type ExchangeIconProps = SVGProps<SVGSVGElement> & {
  exchange: string
}

/**
 * Maps exchange names to their respective icon components
 */
export function ExchangeIcon({ exchange, className, ...props }: ExchangeIconProps) {
  const exchangeLower = exchange.toLowerCase()

  if (exchangeLower.includes('binance')) {
    return <TokenBrandedBinance className={className} {...props} />
  }

  // Fallback: return first letter as text in a similar size
  return (
    <span
      className={className}
      style={{
        fontWeight: 'bold',
        fontSize: '0.875rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {exchange.charAt(0).toUpperCase()}
    </span>
  )
}
