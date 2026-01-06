'use client'

import { useState, useMemo } from 'react'
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Progress,
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
  useDisclosure,
} from '@chakra-ui/react'
import { useLoanPosition } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPool'
import { fromTokenDecimals } from '@repo/lib/modules/lend'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import ButtonGroup, {
  ButtonGroupOption,
} from '@repo/lib/shared/components/btns/button-group/ButtonGroup'
import { RepayLoanModal } from './RepayLoanModal'
import { LoanRepaymentsTable } from './LoanRepaymentsTable'

export interface ActiveLoansSectionProps {
  loans: Array<{
    id: string
    wallet_id: string
    pool: string
    principal_amount: string
    borrow_index: string
    created_at: string
    status: string
    collateral_asset: string
    transaction?: string | null
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
  isLoading: boolean
  walletId: string
}

enum LoanTab {
  ACTIVE = 'active',
  REPAID = 'repaid',
  REPAYMENTS = 'repayments',
}

interface LoanTabOption extends ButtonGroupOption {
  value: LoanTab
}

export function ActiveLoansSection({
  loans,
  pools,
  assets,
  isLoading,
  walletId,
}: ActiveLoansSectionProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedLoan, setSelectedLoan] = useState<ActiveLoansSectionProps['loans'][0] | null>(null)

  // Create lookup maps for quick access
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
  console.log('loans:', loans)

  // Filter for active loans only
  const activeLoans = useMemo(() => {
    return loans.filter(loan => loan.status === 'active')
  }, [loans])
  console.log('activeLoans', activeLoans)

  // Filter for repaid loans only
  const repaidLoans = useMemo(() => {
    return loans.filter(loan => loan.status === 'repaid')
  }, [loans])

  // Tab options
  const loanTabs: LoanTabOption[] = [
    { value: LoanTab.ACTIVE, label: `Active Loans` },
    { value: LoanTab.REPAID, label: 'Repaid Loans' },
    { value: LoanTab.REPAYMENTS, label: 'Loan Repayments' },
  ]

  const [activeTab, setActiveTab] = useState<LoanTabOption>(loanTabs[0])

  const handleTabChange = (option: ButtonGroupOption) => {
    setActiveTab(option as LoanTabOption)
  }

  const handleRepayClick = (loan: ActiveLoansSectionProps['loans'][0]) => {
    setSelectedLoan(loan)
    onOpen()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <VStack align="start" spacing={6} w="full">
      <Heading
        background="font.special"
        backgroundClip="text"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="semibold"
      >
        Loans
      </Heading>

      {/* Tab Navigation */}
      <Box w={{ base: 'full', md: '50%' }}>
        <ButtonGroup
          currentOption={activeTab}
          groupId="loan-tabs"
          isFullWidth
          onChange={handleTabChange}
          options={loanTabs}
          size="md"
        />
      </Box>

      {/* Tab Content */}
      {activeTab.value === LoanTab.ACTIVE ? (
        // Active Loans Tab Content
        isLoading ? (
          <Skeleton borderRadius="lg" h="200px" w="full" />
        ) : activeLoans.length === 0 ? (
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
                No active loans yet
              </Text>
              <Text color="font.secondary" fontSize="xs">
                Borrow from a lending pool to see your active loans here
              </Text>
            </VStack>
          </NoisyCard>
        ) : (
          <TableContainer bg={cardBg} borderRadius="lg" shadow="xl" w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Pool</Th>
                  <Th>Collateral Asset</Th>
                  <Th isNumeric>Collateral Amount</Th>
                  <Th isNumeric>Current Debt</Th>
                  <Th>Borrowed On</Th>
                  <Th>Health Factor</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {activeLoans.map(loan => {
                  const pool = poolMap.get(loan.pool)
                  const collateralAsset = assetMap.get(loan.collateral_asset)

                  return (
                    <LoanTableRow
                      collateralAsset={collateralAsset}
                      formatDate={formatDate}
                      key={loan.id}
                      loan={loan}
                      onRepayClick={handleRepayClick}
                      pool={pool}
                    />
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )
      ) : activeTab.value === LoanTab.REPAID ? (
        // Repaid Loans Tab Content
        isLoading ? (
          <Skeleton borderRadius="lg" h="200px" w="full" />
        ) : repaidLoans.length === 0 ? (
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
                No repaid loans yet
              </Text>
              <Text color="font.secondary" fontSize="xs">
                Your completed loan repayments will appear here
              </Text>
            </VStack>
          </NoisyCard>
        ) : (
          <TableContainer bg={cardBg} borderRadius="lg" shadow="xl" w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Pool</Th>
                  <Th>Collateral Asset</Th>
                  <Th isNumeric>Principal Amount</Th>
                  <Th>Borrowed On</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {repaidLoans.map(loan => {
                  const pool = poolMap.get(loan.pool)
                  const collateralAsset = assetMap.get(loan.collateral_asset)

                  return (
                    <RepaidLoanTableRow
                      collateralAsset={collateralAsset}
                      formatDate={formatDate}
                      key={loan.id}
                      loan={loan}
                      pool={pool}
                    />
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )
      ) : (
        // Loan Repayments Tab Content
        <LoanRepaymentsTable assets={assets} loans={loans} pools={pools} />
      )}

      {/* Repay Loan Modal */}
      {selectedLoan && (
        <RepayLoanModal
          asset={
            poolMap.get(selectedLoan.pool)
              ? assetMap.get(poolMap.get(selectedLoan.pool)!.reserve_asset)
              : undefined
          }
          isOpen={isOpen}
          loan={selectedLoan}
          onClose={onClose}
          walletId={walletId}
        />
      )}
    </VStack>
  )
}

interface LoanTableRowProps {
  loan: {
    id: string
    wallet_id: string
    pool: string
    principal_amount: string
    borrow_index: string
    created_at: string
    status: string
    collateral_asset: string
  }
  pool:
    | {
        id: string
        name?: string | null
        title?: string | null
        reserve_asset: string
      }
    | undefined
  collateralAsset:
    | {
        id: string
        name: string
        symbol: string
        icon?: string | null
      }
    | undefined
  onRepayClick: (loan: LoanTableRowProps['loan']) => void
  formatDate: (dateString: string) => string
}

function LoanTableRow({
  loan,
  pool,
  collateralAsset,
  onRepayClick,
  formatDate,
}: LoanTableRowProps) {
  console.log('loan', loan)
  // Fetch loan position to get health factor
  const { data: loanPosition, isLoading: isLoadingPosition } = useLoanPosition({
    loanId: loan.id,
  })
  console.log('loanPosition', loanPosition)

  const healthFactor = loanPosition?.health_factor
    ? parseFloat(String(loanPosition.health_factor)) / 1e18
    : 0

  const isHealthy = healthFactor >= 1

  // Calculate progress percentage (health factor / 2.0 * 100, capped at 100%)
  const healthFactorProgress = Math.min((healthFactor / 2.0) * 100, 100)

  // Color coding: green >= 1.0, yellow 0.5-1.0, red < 0.5
  const getHealthFactorProgressColor = () => {
    if (healthFactor >= 1.0) return 'green'
    if (healthFactor >= 0.5) return 'yellow'
    return 'red'
  }

  // Get current debt and collateral amount from loan position
  const currentDebt = loanPosition?.current_dept
    ? fromTokenDecimals(parseFloat(String(loanPosition.current_dept)))
    : 0

  const collateralAmount = loanPosition?.collateral_amount
    ? fromTokenDecimals(parseFloat(String(loanPosition.collateral_amount)))
    : 0

  // Don't render if the loan has been fully repaid (current debt is essentially 0)
  if (!isLoadingPosition && currentDebt < 0.01) {
    return null
  }

  return (
    <Tr>
      <Td>
        <Text fontSize="sm" fontWeight="semibold">
          {pool?.title ?? pool?.name ?? 'Unknown Pool'}
        </Text>
      </Td>
      <Td>
        <HStack spacing={2}>
          {collateralAsset?.icon && (
            <Box h="20px" w="20px">
              <Box
                alt={collateralAsset.symbol}
                as="img"
                h="full"
                objectFit="contain"
                src={collateralAsset.icon}
                w="full"
              />
            </Box>
          )}
          <Text fontSize="sm" fontWeight="medium">
            {collateralAsset?.symbol || 'Unknown'}
          </Text>
        </HStack>
      </Td>
      <Td isNumeric>
        {isLoadingPosition ? (
          <Skeleton h="20px" w="80px" />
        ) : (
          <Text fontSize="sm" fontWeight="semibold">
            {collateralAmount.toFixed(2)}
          </Text>
        )}
      </Td>
      <Td isNumeric>
        {isLoadingPosition ? (
          <Skeleton h="20px" w="80px" />
        ) : (
          <Text fontSize="sm" fontWeight="bold">
            ${currentDebt.toFixed(2)}
          </Text>
        )}
      </Td>
      <Td>
        <Text fontSize="sm">{formatDate(loan.created_at)}</Text>
      </Td>
      <Td>
        {isLoadingPosition ? (
          <Skeleton h="40px" w="120px" />
        ) : (
          <VStack align="stretch" minW="120px" spacing={1}>
            <HStack justify="space-between" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">
                {healthFactor.toFixed(2)}
              </Text>
              <Badge colorScheme={isHealthy ? 'green' : 'red'} fontSize="xs">
                {isHealthy ? 'Healthy' : 'At Risk'}
              </Badge>
            </HStack>
            <Progress
              colorScheme={getHealthFactorProgressColor()}
              hasStripe={!isHealthy}
              isAnimated={!isHealthy}
              size="sm"
              value={healthFactorProgress}
            />
          </VStack>
        )}
      </Td>
      <Td>
        <Badge colorScheme="green" fontSize="xs">
          Active
        </Badge>
      </Td>
      <Td>
        <Button onClick={() => onRepayClick(loan)} size="md" variant="primary">
          Repay
        </Button>
      </Td>
    </Tr>
  )
}

interface RepaidLoanTableRowProps {
  loan: {
    id: string
    wallet_id: string
    pool: string
    principal_amount: string
    borrow_index: string
    created_at: string
    status: string
    transaction?: string | null
    collateral_asset: string
  }
  pool:
    | {
        id: string
        name?: string | null
        title?: string | null
        reserve_asset: string
      }
    | undefined
  collateralAsset:
    | {
        id: string
        name: string
        symbol: string
        icon?: string | null
      }
    | undefined
  formatDate: (dateString: string) => string
}

function RepaidLoanTableRow({ loan, pool, collateralAsset, formatDate }: RepaidLoanTableRowProps) {
  // Convert principal amount from token decimals to display format
  const principalAmount = parseFloat(loan.principal_amount) / 100000000 // 8 decimal places

  return (
    <Tr>
      <Td>
        <Text fontSize="sm" fontWeight="semibold">
          {pool?.title ?? pool?.name ?? 'Unknown Pool'}
        </Text>
      </Td>
      <Td>
        <HStack spacing={2}>
          {collateralAsset?.icon && (
            <Box h="20px" w="20px">
              <Box
                alt={collateralAsset.symbol}
                as="img"
                h="full"
                objectFit="contain"
                src={collateralAsset.icon}
                w="full"
              />
            </Box>
          )}
          <Text fontSize="sm" fontWeight="medium">
            {collateralAsset?.symbol || 'Unknown'}
          </Text>
        </HStack>
      </Td>
      <Td isNumeric>
        <Text fontSize="sm" fontWeight="semibold">
          ${principalAmount.toFixed(2)}
        </Text>
      </Td>
      <Td>
        <Text fontSize="sm">{formatDate(loan.created_at)}</Text>
      </Td>
      <Td>
        <Badge colorScheme="gray" fontSize="xs">
          Repaid
        </Badge>
      </Td>
    </Tr>
  )
}
