import type { SVGProps } from 'react'
import { Box, Flex, Text, Tooltip, Badge, useColorModeValue } from '@chakra-ui/react'

// SVG Icon Components

function TokenBrandedBinance(props: SVGProps<SVGSVGElement>) {
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
 * Renders the appropriate icon for an exchange
 */
function ExchangeIcon({ exchange, className, ...props }: ExchangeIconProps) {
  const exchangeLower = exchange.toLowerCase().replace(/f$/, '') // Remove 'f' suffix for matching

  // SVG icons
  if (exchangeLower.includes('binance')) {
    return <TokenBrandedBinance className={className} {...props} />
  }

  // Fallback: return first letter
  return (
    <Text
      alignItems="center"
      as="span"
      className={className}
      display="inline-flex"
      fontSize="sm"
      fontWeight="bold"
      justifyContent="center"
    >
      {exchange.charAt(0).toUpperCase()}
    </Text>
  )
}

type ExchangeBadgeProps = {
  exchange: string
  showLabel?: boolean
  showMarketType?: boolean
  className?: string
  iconClassName?: string
}

/**
 * Determines if an exchange is perpetual futures based on naming convention
 */
function isPerps(exchange: string): boolean {
  return exchange.endsWith('f')
}

/**
 * Gets the clean exchange name without the 'f' suffix
 */
function getCleanExchangeName(exchange: string): string {
  return exchange.replace(/f$/, '')
}

/**
 * Gets the market type label
 */
function getMarketType(exchange: string): string {
  return isPerps(exchange) ? 'Perps' : 'Spot'
}

/**
 * Comprehensive exchange badge component with icon, market type badge, and tooltip
 * Can be used throughout the application for consistent exchange representation
 */
export function ExchangeBadge({
  exchange,
  showLabel = false,
  showMarketType = true,
  className = '',
  iconClassName = 'w-4 h-4',
}: ExchangeBadgeProps) {
  const cleanName = getCleanExchangeName(exchange)
  const marketType = getMarketType(exchange)
  const isPerpetual = isPerps(exchange)

  const popoverBg = useColorModeValue('rgb(255, 255, 255)', 'rgb(26, 26, 29)')
  const borderColor = useColorModeValue('rgb(226, 232, 240)', 'rgb(58, 58, 63)')

  const content = (
    <Flex align="center" className={className} gap={1.5}>
      <ExchangeIcon className={iconClassName} exchange={exchange} />
      {showLabel && <Text textTransform="capitalize">{cleanName}</Text>}
      {showMarketType && (
        <Badge
          colorScheme={isPerpetual ? 'primary' : undefined}
          fontSize="9px"
          fontWeight="medium"
          h={4}
          px={1}
          py={0}
          variant={isPerpetual ? 'solid' : 'subtle'}
        >
          {marketType}
        </Badge>
      )}
    </Flex>
  )

  return (
    <Tooltip
      bg={popoverBg}
      borderColor={borderColor}
      borderWidth="1px"
      color="inherit"
      hasArrow
      label={
        <Box fontSize="xs">
          <Text fontWeight="semibold" textTransform="capitalize">
            {cleanName}
          </Text>
          <Text fontSize="xs" opacity={0.7}>
            {isPerpetual ? 'Perpetual Futures' : 'Spot Market'}
          </Text>
        </Box>
      }
    >
      <Flex cursor="help" display="inline-flex">
        {content}
      </Flex>
    </Tooltip>
  )
}
