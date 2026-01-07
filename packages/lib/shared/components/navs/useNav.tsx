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
  roles?: ('institutional' | 'retail')[]
}

export function useNav() {
  const pathname = usePathname()

  const allAppLinks: AppLink[] = [
    {
      href: '/trade',
      label: 'Trade',
      roles: ['institutional', 'retail'],
    },

    // {
    //   href: '/perps',
    //   label: 'Perps',
    //   roles: ['institutional', 'retail'],
    // },
    {
      href: '/lend',
      label: 'Lend',
      roles: ['institutional', 'retail'],
    },
    {
      href: '/listings',
      label: 'Listings',
      roles: ['institutional', 'retail'],
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
      roles: ['institutional', 'retail'],
    },
    {
      href: '/faucet',
      label: 'Faucet',
      roles: ['institutional', 'retail'],
    },
    // {
    //   href: '/docs',
    //   label: 'Docs',
    // },
  ]

  function getFilteredLinks(userRole?: 'institutional' | 'retail') {
    return allAppLinks.filter(link => {
      if (!link.roles) return true
      if (!userRole) return false
      return link.roles.includes(userRole)
    })
  }

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  function isLinkActive(path: string) {
    return pathname === path
  }

  return { allAppLinks, getFilteredLinks, linkColorFor, isLinkActive }
}
