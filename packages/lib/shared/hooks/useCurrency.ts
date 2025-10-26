'use client'

import { useFxRates } from './FxRatesProvider'
import { symbolForCurrency } from '../utils/currencies'
import { Numberish, bn, fNum } from '../utils/numbers'

type CurrencyOpts = {
  withSymbol?: boolean
  abbreviated?: boolean
  noDecimals?: boolean
  forceThreeDecimals?: boolean
}

export function useCurrency() {

  const { getFxRate, hasFxRates } = useFxRates()
  const currency = 'KES' // Default to KES (Kenya Shilling)

  // Converts a KES value to the user's currency value.
  function toUserCurrency(kesVal: Numberish): string {
    const amount = kesVal.toString()
    const fxRate = getFxRate(currency as any)

    return bn(amount).times(fxRate).toString()
  }

  function formatCurrency(value: string | undefined) {
    const symbol = hasFxRates ? symbolForCurrency(currency as any) : 'Ksh'
    return `${symbol} ${value ?? '0'}`
  }

  function parseCurrency(value: string) {
    return value.replace(/^(Ksh|Ksh)\s*/, '')
  }

  // Converts a KES value to the user's currency and formats in fiat style.
  function toCurrency(
    kesVal: Numberish,
    {
      withSymbol = true,
      abbreviated = true,
      noDecimals = false,
      forceThreeDecimals = false,
    }: CurrencyOpts = {}
  ): string {
    const symbol = hasFxRates ? symbolForCurrency(currency as any) : 'Ksh'
    const convertedAmount = toUserCurrency(kesVal)

    const formattedAmount = fNum(noDecimals ? 'integer' : 'fiat', convertedAmount, {
      abbreviated,
      forceThreeDecimals,
    })

    if (formattedAmount.startsWith('<')) {
      return withSymbol ? '<' + symbol + ' ' + formattedAmount.substring(1) : formattedAmount
    }

    return withSymbol ? symbol + ' ' + formattedAmount : formattedAmount
  }

  return { toCurrency, formatCurrency, parseCurrency }
}
