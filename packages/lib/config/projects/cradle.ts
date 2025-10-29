import { ProjectConfig } from '@repo/lib/config/config.types'

export const ProjectConfigCradle: ProjectConfig = {
  projectId: 'cradle',
  projectName: 'Cradle',
  projectUrl: 'https://cradleprotocol.com',
  projectLogo: 'https://cradleprotocol.com/images/icons/cradle.svg',
  links: {
    appLinks: [],
    ecosystemLinks: [
      { label: 'Trade securities', href: 'https://app.cradleprotocol.com/' },
      { label: 'Documentation', href: 'https://docs.cradleprotocol.com/' },
      { label: 'API Reference', href: 'https://api.cradleprotocol.com/' },
      { label: 'GitHub Repos', href: 'https://github.com/cradle-protocol/' },
      { label: 'Community', href: 'https://discord.cradleprotocol.com/' },
      { label: 'Developer Guide', href: 'https://docs.cradleprotocol.com/developers' },
    ],
    socialLinks: [
      {
        iconType: 'x',
        href: 'https://x.com/CradleProtocol',
      },
      {
        iconType: 'discord',
        href: 'https://discord.cradleprotocol.com/',
      },
      {
        iconType: 'youtube',
        href: 'https://youtube.com/CradleProtocol',
      },
      {
        iconType: 'tg',
        href: 'https://t.me/CradleProtocol',
      },
      {
        iconType: 'medium',
        href: 'https://medium.com/cradle-protocol',
      },
    ],
    legalLinks: [
      { label: 'Feedback' },
      { label: 'Terms of use', href: '/terms-of-use' },
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Cookie policy', href: '/cookie-policy' },
      { label: 'Risk disclosure', href: '/risk-disclosure' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
  options: {
    allowCreateWallet: false,
  },
  footer: {
    linkSections: [
      {
        title: 'BUILD ON CRADLE',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Documentation', href: 'https://docs.cradleprotocol.com', isExternal: true },
          { label: 'API Reference', href: 'https://api.cradleprotocol.com', isExternal: true },
          { label: 'GitHub Repos', href: 'https://github.com/cradle-protocol', isExternal: true },
          {
            label: 'Developer Guide',
            href: 'https://docs.cradleprotocol.com/developers',
            isExternal: true,
          },
        ],
      },
      {
        title: 'USE CRADLE PROTOCOL',
        links: [
          { label: 'Trade securities', href: '/trade' },
          { label: 'Explore pools', href: '/pools' },
          { label: 'View portfolio', href: '/portfolio' },
          { label: 'Borrow & Lend', href: '/lending' },
          { label: 'Access stables', href: 'https://stables.cradleprotocol.com', isExternal: true },
        ],
      },
      {
        title: 'ECOSYSTEM',
        links: [
          { label: 'Community', href: 'https://discord.cradleprotocol.com', isExternal: true },
          { label: 'Governance', href: 'https://governance.cradleprotocol.com', isExternal: true },
          {
            label: 'Security audits',
            href: 'https://docs.cradleprotocol.com/security',
            isExternal: true,
          },
          {
            label: 'Brand assets',
            href: 'https://github.com/cradle-protocol/brand-assets',
            isExternal: true,
          },
          {
            label: 'Partner network',
            href: 'https://partners.cradleprotocol.com',
            isExternal: true,
          },
        ],
      },
    ],
  },
}
