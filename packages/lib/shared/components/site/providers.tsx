'use client'

import { ReactNode } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Web3Provider } from '@repo/lib/modules/web3/Web3Provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <Web3Provider>{children}</Web3Provider>
    </NuqsAdapter>
  )
}
