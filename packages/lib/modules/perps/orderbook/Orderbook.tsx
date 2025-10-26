import { useMemo, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import {
  Box,
  Container,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { useWebSocket } from './hooks/useWebSocket';
import { useAggregatedOrderbook } from './hooks/useAggregatedOrderbook';
import { OrderbookCard } from './components/OrderbookCard';
import { filterExchangesByMarket, sortExchangesByGroup } from '@repo/lib/shared/utils/calculations';
import { MarketFilter } from '@repo/lib/shared/types';

function Orderbook() {
  const [marketFilter] = useLocalStorage<MarketFilter>('marketFilter', 'all');
  const [showAggregate] = useState(false);
  const { orderbooks, stats } = useWebSocket('ws://localhost:8086/ws');

  // Filter and sort orderbooks based on market filter
  const filteredOrderbooks = useMemo(() => {
    const filtered = Object.entries(orderbooks).filter(([exchange]) =>
      filterExchangesByMarket(exchange, marketFilter)
    );
    return sortExchangesByGroup(filtered);
  }, [orderbooks, marketFilter]);

  // Get aggregated orderbook for filtered exchanges
  const filteredOrderbooksData = useMemo(() => {
    return Object.fromEntries(filteredOrderbooks);
  }, [filteredOrderbooks]);

  const aggregated = useAggregatedOrderbook(filteredOrderbooksData);

  return (
    <Box minH="100vh">
      <Container maxW="1400px" px={{ base: 4, md: 6, lg: 8 }}>
       
        <VStack align="stretch" spacing={6}>
        

          <Box as="section">
         
            <Flex gap={4} overflowX="auto" pb={2}>
              {showAggregate ? (
                <OrderbookCard
                  asks={aggregated.asks}
                  bids={aggregated.bids}
                  stats={aggregated.stats}
                />
              ) : (
                filteredOrderbooks.map(([exchange, data]) => (
                  <OrderbookCard
                    asks={data.asks}
                    bids={data.bids}
                    key={exchange}
                    stats={stats[exchange]}
                  />
                ))
              )}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default Orderbook;
