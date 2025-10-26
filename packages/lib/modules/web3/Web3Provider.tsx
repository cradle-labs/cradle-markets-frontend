'use client'

import { PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { UserAccountProvider } from './UserAccountProvider'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const config = getDefaultConfig({
  appName: 'Cradle',
  projectId,
  chains: [mainnet, sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <UserAccountProvider>
            {children}
          </UserAccountProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}