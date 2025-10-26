import { memo, useMemo } from 'react';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import type { OrderbookLevel, StatsData } from '@repo/lib/shared/types';
import { calculateMaxCumulative, formatNumber } from '@repo/lib/shared/utils/calculations';
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard';

type OrderbookCardProps = {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  stats: StatsData[string];
  rowsPerSide?: number;
};

/**
 * Renders a single orderbook card with bids/asks
 * Memoized to prevent unnecessary re-renders
 */
export const OrderbookCard = memo(function OrderbookCard({
  bids: allBids,
  asks: allAsks,
  stats,
  rowsPerSide = 10,
}: OrderbookCardProps) {
  const spread = stats ? parseFloat(stats.spread) : 0;
  const midPrice = stats ? parseFloat(stats.midPrice) : 0;
  const bestBid = stats ? parseFloat(stats.bestBid) : 0;
  const bestAsk = stats ? parseFloat(stats.bestAsk) : 0;

  // Calculate bid/ask imbalance
  const imbalance = useMemo(() => {
    if (!stats) return { totalBids: 0, totalAsks: 0, bidPercentage: 50 };

    const totalBids = parseFloat(stats.totalBidsQty) || 0;
    const totalAsks = parseFloat(stats.totalAsksQty) || 0;
    const total = totalBids + totalAsks;

    return {
      totalBids,
      totalAsks,
      bidPercentage: total > 0 ? (totalBids / total) * 100 : 50,
    };
  }, [stats]);

  const maxAskCum = calculateMaxCumulative(allAsks);
  const maxBidCum = calculateMaxCumulative(allBids);

  // Filter and slice relevant levels
  const relevantAsks = allAsks.filter((ask) => parseFloat(ask.price) >= bestAsk);
  const displayAsks = relevantAsks.slice(0, rowsPerSide).reverse();

  const relevantBids = allBids.filter((bid) => parseFloat(bid.price) <= bestBid);
  const displayBids = relevantBids.slice(0, rowsPerSide);

  // Pad with nulls if needed
  const paddedAsks = [
    ...Array(Math.max(0, rowsPerSide - displayAsks.length)).fill(null),
    ...displayAsks,
  ];

  const paddedBids = [
    ...displayBids,
    ...Array(Math.max(0, rowsPerSide - displayBids.length)).fill(null),
  ];

  return (
    <Box
      flexShrink={0}
      mt={4}
      w="300px"
    >
      <NoisyCard
        cardProps={{
          borderRadius: 'lg',
          border: '1px solid',
          borderColor: 'border.base',
        }}
        contentProps={{
          p: 2,
          position: 'relative',
        }}
      >
   

      <Grid gap={2} mb={1} px={2} templateColumns="repeat(3, 1fr)">
        <Text color="font.secondary" fontSize="10px" fontWeight="semibold" textTransform="uppercase">Price</Text>
        <Text color="font.secondary" fontSize="10px" fontWeight="semibold" textAlign="right" textTransform="uppercase">Size</Text>
        <Text color="font.secondary" fontSize="10px" fontWeight="semibold" textAlign="right" textTransform="uppercase">Sum</Text>
      </Grid>

      <Box>
        {paddedAsks.map((ask, idx) => {
          if (ask === null) {
            return (
              <Grid
                borderRadius="md"
                fontFamily="mono"
                fontSize="11px"
                gap={2}
                key={`ask-padding-${idx}`}
                lineHeight="tight"
                opacity={0}
                px={2}
                py={0.5}
                templateColumns="repeat(3, 1fr)"
              >
                <Text>-</Text>
                <Text textAlign="right">-</Text>
                <Text textAlign="right">-</Text>
              </Grid>
            );
          }
          const pct = (parseFloat(ask.cumulative) / maxAskCum) * 100;
          return (
            <Grid
              borderRadius="md"
              fontFamily="mono"
              fontSize="11px"
              gap={2}
              key={`ask-${idx}`}
              lineHeight="tight"
              position="relative"
              px={2}
              templateColumns="repeat(3, 1fr)"
            >
              <Box
                bg="rgba(239, 68, 68, 0.1)"
                borderRadius="md"
                bottom={0}
                position="absolute"
                right={0}
                top={0}
                width={`${pct}%`}
              />
              <Text color="red.400" position="relative" zIndex={10}>
                {formatNumber(parseFloat(ask.price), 2)}
              </Text>
              <Text color="font.secondary" position="relative" textAlign="right" zIndex={10}>
                {formatNumber(parseFloat(ask.quantity), 4)}
              </Text>
              <Text color="font.secondary" opacity={0.8} position="relative" textAlign="right" zIndex={10}>
                {formatNumber(parseFloat(ask.cumulative), 4)}
              </Text>
            </Grid>
          );
        })}
      </Box>

      <Box
        bg="background.level2"
        border="1px solid"
        borderColor="border.base"
        borderRadius="md"
        my={1.5}
        px={2}
        py={1.5}
        textAlign="center"
      >
        <Flex align="center" fontSize="xs" gap={3} justify="center">
          <Box>
            <Text as="span" color="font.secondary" fontSize="10px">Mid </Text>
            <Text as="span" color="yellow.400" fontWeight="semibold">
              ${formatNumber(midPrice, 2)}
            </Text>
          </Box>
          <Box bg="border.base" h={3} w="1px" />
          <Box>
            <Text as="span" color="font.secondary" fontSize="10px">Spread </Text>
            <Text as="span" color="blue.400" fontWeight="semibold">
              ${formatNumber(spread, 2)}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box>
        {paddedBids.map((bid, idx) => {
          if (bid === null) {
            return (
              <Grid
                borderRadius="md"
                fontFamily="mono"
                fontSize="11px"
                gap={2}
                key={`bid-padding-${idx}`}
                lineHeight="tight"
                opacity={0}
                px={2}
                py={0.5}
                templateColumns="repeat(3, 1fr)"
              >
                <Text>-</Text>
                <Text textAlign="right">-</Text>
                <Text textAlign="right">-</Text>
              </Grid>
            );
          }
          const pct = (parseFloat(bid.cumulative) / maxBidCum) * 100;
          return (
            <Grid
              borderRadius="md"
              fontFamily="mono"
              fontSize="11px"
              gap={2}
              key={`bid-${idx}`}
              lineHeight="tight"
              position="relative"
              px={2}
              py={0.5}
              templateColumns="repeat(3, 1fr)"
            >
              <Box
                bg="rgba(34, 197, 94, 0.1)"
                borderRadius="md"
                bottom={0}
                position="absolute"
                right={0}
                top={0}
                width={`${pct}%`}
              />
              <Text color="green.400" position="relative" zIndex={10}>
                {formatNumber(parseFloat(bid.price), 2)}
              </Text>
              <Text color="font.secondary" position="relative" textAlign="right" zIndex={10}>
                {formatNumber(parseFloat(bid.quantity), 4)}
              </Text>
              <Text color="font.secondary" opacity={0.8} position="relative" textAlign="right" zIndex={10}>
                {formatNumber(parseFloat(bid.cumulative), 4)}
              </Text>
            </Grid>
          );
        })}
      </Box>

      <Box mt={3} px={2}>
        <Box bg="background.level2" borderRadius="lg" h={6} overflow="hidden" position="relative">
          <Box
            bg="rgba(34, 197, 94, 0.3)"
            h="full"
            left={0}
            position="absolute"
            top={0}
            transition="all 0.3s"
            width={`${imbalance.bidPercentage}%`}
          />

          <Box
            bg="border.base"
            bottom={0}
            left="50%"
            opacity={0.5}
            position="absolute"
            top={0}
            transform="translateX(-50%)"
            w="1px"
          />

          <Flex
            align="center"
            justify="center"
            left="50%"
            position="absolute"
            top="50%"
            transform="translate(-50%, -50%)"
          >
            <Box
              bg={
                imbalance.bidPercentage > 50
                  ? 'rgba(34, 197, 94, 0.8)'
                  : imbalance.bidPercentage < 50
                  ? 'rgba(239, 68, 68, 0.8)'
                  : 'background.level3'
              }
              borderRadius="md"
              color={imbalance.bidPercentage !== 50 ? 'white' : 'font.secondary'}
              fontSize="9px"
              fontWeight="bold"
              px={1.5}
              py={0.5}
            >
              {imbalance.bidPercentage > 50
                ? `↑ ${formatNumber(imbalance.bidPercentage - 50, 1)}%`
                : imbalance.bidPercentage < 50
                ? `↓ ${formatNumber(50 - imbalance.bidPercentage, 1)}%`
                : '='
              }
            </Box>
          </Flex>

          <Flex
            align="center"
            fontFamily="mono"
            fontSize="10px"
            fontWeight="semibold"
            inset={0}
            justify="space-between"
            position="absolute"
            px={2}
          >
            <Text color="green.400" fontSize={"12px"}>
              Bids: {formatNumber(imbalance.totalBids, 2)}
            </Text>
            <Text color="red.400" fontSize={"12px"}>
              Asks: {formatNumber(imbalance.totalAsks, 2)}
            </Text>
          </Flex>
        </Box>
      </Box>
      </NoisyCard>
    </Box>
  );
});