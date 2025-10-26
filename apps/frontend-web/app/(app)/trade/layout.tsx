import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Trade on Cradle',
  description: `
    Buy and sell tokenized NSE securities on Cradle.
  `,
}

export default async function Pools({ children }: PropsWithChildren) {
  return <>{children}</>
}
