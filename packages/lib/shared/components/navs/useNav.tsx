import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { IconType } from './SocialIcon'

export type AppLink = {
  href?: string
  label?: string
  icon?: ReactNode
  isExternal?: boolean
  iconType?: IconType
  onClick?: () => void
}

export function useNav() {
  const pathname = usePathname()

  const defaultAppLinks: AppLink[] = [
    {
      href: '/trade',
      label: 'Trade',
    },
    {
      href: '/perps',
      label: 'Perps',
    },
    {
      href: '/lend',
      label: 'Lend',
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
    },
    {
      href: '/cash',
      label: 'Cash',
    },
    {
      href: '/docs',
      label: 'Docs',
    },
  
  ]

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  function isLinkActive(path: string) {
    return pathname === path
  }

  return { defaultAppLinks, linkColorFor, isLinkActive }
}
