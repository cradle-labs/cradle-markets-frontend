'use client'

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

export enum PerpsTradingTab {
  BUY = 'buy',
  SELL = 'sell',
}

type PerpsTradingTabsContextValue = {
  activeTab: { label: string; value: PerpsTradingTab }
  setActiveTab: (tab: { label: string; value: PerpsTradingTab }) => void
  tabsList: Array<{ label: string; value: PerpsTradingTab }>
}

const PerpsTradingTabsContext = createContext<PerpsTradingTabsContextValue | null>(null)

export function PerpsTradingTabsProvider({ children }: { children: ReactNode }) {
  const tabsList = useMemo(
    () => [
      { label: 'Buy', value: PerpsTradingTab.BUY },
      { label: 'Sell', value: PerpsTradingTab.SELL },
    ],
    []
  )

  const [activeTab, setActiveTab] = useState(tabsList[0])

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      tabsList,
    }),
    [activeTab, tabsList]
  )

  return (
    <PerpsTradingTabsContext.Provider value={value}>{children}</PerpsTradingTabsContext.Provider>
  )
}

export function usePerpsTradingTabs() {
  const context = useContext(PerpsTradingTabsContext)
  if (!context) {
    throw new Error('usePerpsTradingTabs must be used within PerpsTradingTabsProvider')
  }
  return context
}
