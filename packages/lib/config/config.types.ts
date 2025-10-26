import { Address } from 'viem'
import { AppLink } from '../shared/components/navs/useNav'
import { LinkSection } from '../shared/components/navs/footer.types'

export interface TokensConfig {
  addresses: {
    bal: Address
    wNativeAsset: Address
    auraBal?: Address
    veBalBpt?: Address
    beets?: Address
  }
  nativeAsset: {
    name: string
    address: Address
    symbol: string
    decimals: number
  }
  stakedAsset?: {
    name: string
    address: Address
    symbol: string
    decimals: number
  }
  supportedWrappers?: {
    baseToken: Address
    wrappedToken: Address
  }[]
  doubleApprovalRequired?: string[]
  defaultSwapTokens?: {
    tokenIn?: Address
    tokenOut?: Address
  }
  popularTokens?: Record<Address, string>
}

export interface BlockExplorerConfig {
  baseUrl: string
  name: string
}

export interface Config {
  appEnv: 'dev' | 'test' | 'staging' | 'prod'
  apiUrl: string
}

export interface Banners {
  headerSrc: string
  footerSrc: string
}

// Unused for now - keeping for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExternalUrls {
  poolComposerUrl: string
}

export type OptionsConfig = {
  hidePoolTags?: string[]
  hideProtocolVersion?: string[]
  showPoolName?: boolean
  showVeBal?: boolean
  showMaBeets?: boolean
  allowCreateWallet?: boolean
  isOnSafeAppList?: boolean
}

type Links = {
  appLinks: AppLink[]
  ecosystemLinks: AppLink[]
  socialLinks: AppLink[]
  legalLinks: AppLink[]
}

type PartnerCard = {
  backgroundImage: string
  bgColor: string
  ctaText: string
  ctaUrl: string
  description: string
  iconName: string
  title: string
  externalLink?: boolean
}

export type PromoItem = {
  id: number
  icon: string
  label: string
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
  linkText?: string
  linkURL?: string
  linkExternal?: boolean
  bgImageActive?: {
    directory: string
    imgName: string
  }
  bgImageInactive?: {
    directory: string
    imgName: string
  }
}

export interface ProjectConfig {
  projectId: 'cradle'
  projectUrl: string
  projectName: string
  projectLogo: string
  links: Links
  options?: OptionsConfig
  footer: { linkSections: LinkSection[] }
  partnerCards?: PartnerCard[]
}
