import { Address, HumanAmount } from '@balancer/sdk'

// Stub type for GqlToken
export type GqlToken = {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: number
  logoURI?: string
}

export type TokenBase = Pick<GqlToken, 'address' | 'name' | 'symbol' | 'decimals' | 'chainId'>

export interface TokenAmount {
  address: string
  chainId: number
  decimals: number
  amount: bigint
  formatted: string
}

export interface TokenAmountHumanReadable {
  address: string
  amount: string
}

export type HumanTokenAmount = {
  humanAmount: HumanAmount | ''
  tokenAddress: Address
}

export type HumanTokenAmountWithAddress = {
  humanAmount: HumanAmount | ''
  tokenAddress: Address
  symbol: string
}

export interface TokenAmountScaled {
  address: string
  amount: bigint
}
export interface TokenBaseWithAmount extends TokenBase {
  amount: string
}

export type AmountHumanReadable = string
export type AmountScaled = bigint
export type AmountScaledString = string

export type BalanceMap = Map<string, AmountHumanReadable>

export interface AmountHumanReadableMap {
  [address: string]: AmountHumanReadable
}

export type ApiToken = {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: number
  logoURI?: string | null
  index?: number
  wrappedToken?: ApiToken
  underlyingToken?: ApiToken
  useWrappedForAddRemove?: boolean
  useUnderlyingForAddRemove?: boolean
  weight?: string
  priceRate?: string
  priceRateProviderData?: any
}

export type CustomToken = {
  name: string
  chain: string | number
  address: Address
  symbol: string
  logoURI: string
  decimals: number
}

export type BalanceForFn = (token: TokenBase | string) => TokenAmount | undefined

export type InfoPopoverToken = {
  address: Address
  symbol: string
  chain: string | number
}
