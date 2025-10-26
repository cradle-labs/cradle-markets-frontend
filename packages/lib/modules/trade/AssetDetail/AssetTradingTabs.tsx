'use client'

import { createContext, PropsWithChildren, useState } from 'react'
import { useMandatoryContext } from '@repo/lib/shared/utils/contexts'

export enum AssetTradingTab {
  BUY = 'buy',
  SELL = 'sell',
}

export interface AssetTradingTabOption {
  value: AssetTradingTab
  label: string
}

const tradingTabs: AssetTradingTabOption[] = [
  { value: AssetTradingTab.BUY, label: 'Buy' },
  { value: AssetTradingTab.SELL, label: 'Sell' },
]

type AssetTradingTabsContextType = ReturnType<typeof useAssetTradingTabsLogic>

const AssetTradingTabsContext = createContext<AssetTradingTabsContextType | null>(null)

export function useAssetTradingTabsLogic() {
  const [activeTab, setActiveTab] = useState(tradingTabs[0]) // Default to Buy

  return {
    tabsList: tradingTabs,
    activeTab,
    setActiveTab,
  }
}

export function AssetTradingTabsProvider({ children }: PropsWithChildren) {
  const hook = useAssetTradingTabsLogic()
  return <AssetTradingTabsContext.Provider value={hook}>{children}</AssetTradingTabsContext.Provider>
}

export const useAssetTradingTabs = (): AssetTradingTabsContextType =>
  useMandatoryContext(AssetTradingTabsContext, 'AssetTradingTabs')
