'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Box,
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useLoanRepayments } from '@repo/lib/cradle-client-ts/hooks/lending/useRepayments'
import { fromTokenDecimals } from '@repo/lib/modules/lend'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'

export interface LoanRepaymentsTableProps {
  loans: Array<{
    id: string
    wallet_id: string
    pool: string
    principal_amount: string
    borrow_index: string
    created_at: string
    status: string
    collateral_asset: string
  }>
  pools: Array<{
    id: string
    name?: string | null
    title?: string | null
    reserve_asset: string
  }>
  assets: Array<{
    id: string
    name: string
    symbol: string
    icon?: string | null
  }>
}

export function LoanRepaymentsTable({ loans, pools, assets }: LoanRepaymentsTableProps) {
  // Create lookup maps
  const poolMap = useMemo(() => {
    const map = new Map()
    pools.forEach(pool => map.set(pool.id, pool))
    return map
  }, [pools])

  const assetMap = useMemo(() => {
    const map = new Map()
    assets.forEach(asset => map.set(asset.id, asset))
    return map
  }, [assets])

  // Get all loans (not just active, to show all historical repayments)
  const allLoans = useMemo(() => {
    return loans
  }, [loans])

  if (allLoans.length === 0) {
    return (
      <NoisyCard
        cardProps={{
          borderRadius: 'lg',
          w: 'full',
        }}
        contentProps={{
          p: 8,
          position: 'relative',
        }}
        shadowContainerProps={{
          shadow: 'innerXl',
        }}
      >
        <VStack spacing={2}>
          <Text color="font.secondary" fontSize="sm">
            No loans yet
          </Text>
          <Text color="font.secondary" fontSize="xs">
            Loan repayment history will appear here
          </Text>
        </VStack>
      </NoisyCard>
    )
  }

  return <RepaymentsContent allLoans={allLoans} assetMap={assetMap} poolMap={poolMap} />
}

interface RepaymentsContentProps {
  allLoans: LoanRepaymentsTableProps['loans']
  poolMap: Map<string, LoanRepaymentsTableProps['pools'][0]>
  assetMap: Map<string, LoanRepaymentsTableProps['assets'][0]>
}

function RepaymentsContent({ allLoans, poolMap, assetMap }: RepaymentsContentProps) {
  const [hasDisplayedContent, setHasDisplayedContent] = useState(false)

  return (
    <VStack align="stretch" spacing={4} w="full">
      {allLoans.map(loan => (
        <LoanRepaymentRowsWithCallback
          assetMap={assetMap}
          key={loan.id}
          loan={loan}
          onContentDisplayed={() => setHasDisplayedContent(true)}
          poolMap={poolMap}
        />
      ))}
      {!hasDisplayedContent && (
        <NoisyCard
          cardProps={{
            borderRadius: 'lg',
            w: 'full',
          }}
          contentProps={{
            p: 8,
            position: 'relative',
          }}
          shadowContainerProps={{
            shadow: 'innerXl',
          }}
        >
          <VStack spacing={2}>
            <Text color="font.secondary" fontSize="sm">
              No loan repayments yet
            </Text>
            <Text color="font.secondary" fontSize="xs">
              Make loan repayments to see your payment history here
            </Text>
          </VStack>
        </NoisyCard>
      )}
    </VStack>
  )
}

interface LoanRepaymentRowsWithCallbackProps {
  loan: LoanRepaymentsTableProps['loans'][0]
  poolMap: Map<string, LoanRepaymentsTableProps['pools'][0]>
  assetMap: Map<string, LoanRepaymentsTableProps['assets'][0]>
  onContentDisplayed: () => void
}

function LoanRepaymentRowsWithCallback({
  loan,
  poolMap,
  assetMap,
  onContentDisplayed,
}: LoanRepaymentRowsWithCallbackProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  console.log('loan', loan)

  // Fetch repayments for this loan
  const { data: repayments, isLoading } = useLoanRepayments({
    loanId: loan.id,
    enabled: true,
  })

  console.log('repayments', repayments)

  // Deduplicate repayments by transaction ID
  const uniqueRepayments = useMemo(() => {
    if (!repayments) return []

    const seen = new Set<string>()
    return repayments.filter(repayment => {
      if (!repayment.transaction || seen.has(repayment.transaction)) {
        return false
      }
      seen.add(repayment.transaction)
      return true
    })
  }, [repayments])

  // Notify parent when content will be displayed
  useEffect(() => {
    if (!isLoading && uniqueRepayments && uniqueRepayments.length > 0) {
      onContentDisplayed()
    }
  }, [isLoading, uniqueRepayments, onContentDisplayed])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return <Skeleton borderRadius="lg" h="100px" w="full" />
  }

  if (!uniqueRepayments || uniqueRepayments.length === 0) {
    return null // Don't show loans with no repayments
  }

  const pool = poolMap.get(loan.pool)
  const borrowedAsset = pool ? assetMap.get(pool.reserve_asset) : undefined

  return (
    <TableContainer bg={cardBg} borderRadius="lg" shadow="xl" w="full">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Pool</Th>
            <Th>Borrowed Asset</Th>
            <Th isNumeric>Repayment Amount</Th>
            <Th>Repayment Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {uniqueRepayments.map(repayment => (
            <Tr key={repayment.id}>
              <Td>
                <Text fontSize="sm" fontWeight="semibold">
                  {pool?.title ?? pool?.name ?? 'Unknown Pool'}
                </Text>
              </Td>
              <Td>
                <HStack spacing={2}>
                  {borrowedAsset?.icon && (
                    <Box h="20px" w="20px">
                      <Box
                        alt={borrowedAsset.symbol}
                        as="img"
                        h="full"
                        objectFit="contain"
                        src={borrowedAsset.icon}
                        w="full"
                      />
                    </Box>
                  )}
                  <Text fontSize="sm" fontWeight="medium">
                    {borrowedAsset?.symbol || 'Unknown'}
                  </Text>
                </HStack>
              </Td>
              <Td isNumeric>
                <Text fontSize="sm" fontWeight="semibold">
                  ${fromTokenDecimals(parseFloat(repayment.repayment_amount)).toFixed(2)}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm">{formatDate(repayment.repayment_date)}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
