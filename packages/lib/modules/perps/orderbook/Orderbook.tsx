import { useMemo } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { Box } from '@chakra-ui/react'
import { useWebSocket } from './hooks/useWebSocket'
import { useAggregatedOrderbook } from './hooks/useAggregatedOrderbook'
import { OrderbookCard } from './components/OrderbookCard'
import { filterExchangesByMarket, sortExchangesByGroup } from '@repo/lib/shared/utils/calculations'
import { MarketFilter } from '@repo/lib/shared/types'

function Orderbook() {
  const [marketFilter] = useLocalStorage<MarketFilter>('marketFilter', 'all')
  const { orderbooks } = useWebSocket('ws://localhost:8086/ws')

  // Filter and sort orderbooks based on market filter
  const filteredOrderbooks = useMemo(() => {
    const filtered = Object.entries(orderbooks).filter(([exchange]) =>
      filterExchangesByMarket(exchange, marketFilter)
    )
    return sortExchangesByGroup(filtered)
  }, [orderbooks, marketFilter])

  // Get aggregated orderbook for filtered exchanges
  const filteredOrderbooksData = useMemo(() => {
    return Object.fromEntries(filteredOrderbooks)
  }, [filteredOrderbooks])

  const aggregated = useAggregatedOrderbook(filteredOrderbooksData)

  return (
    <Box>
      <OrderbookCard asks={aggregated.asks} bids={aggregated.bids} stats={aggregated.stats} />
    </Box>
  )
}

export default Orderbook
