import { Box } from '@chakra-ui/react'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: `Cradle—Tokenized NSE Securities`,
  description: `The ultimate platform for tokenized NSE securities. Cradle perfectly balances simplicity and flexibility to reshape the future of African capital markets.`,
  openGraph: {
    title: `Cradle—Tokenized NSE Securities`,
    description: `The ultimate platform for tokenized NSE securities. Cradle perfectly balances simplicity and flexibility to reshape the future of African capital markets.`,
    siteName: 'Cradle',
  },
}

export default function MarketingLayout({ children }: PropsWithChildren) {
  return <Box>{children}</Box>
}
