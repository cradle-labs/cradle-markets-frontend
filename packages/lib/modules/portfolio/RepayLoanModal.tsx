'use client'

import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Skeleton,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useLoanPosition } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPool'
import { cradleQueryKeys } from '@repo/lib/cradle-client-ts/queryKeys'
import { fromTokenDecimals, toTokenDecimals } from '@repo/lib/modules/lend'
import { repayBorrow } from '@repo/lib/actions/lending'

// Helper function to format numbers with commas for thousands
const formatNumberWithCommas = (value: string | number, decimals: number = 8): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export interface RepayLoanModalProps {
  isOpen: boolean
  onClose: () => void
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
  walletId: string
  asset:
    | {
        id: string
        name: string
        symbol: string
        icon?: string | null
      }
    | undefined
}

export function RepayLoanModal({ isOpen, onClose, loan, walletId, asset }: RepayLoanModalProps) {
  const [repayAmount, setRepayAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()
  console.log('loan', loan)

  // Fetch the loan position details
  const { data: loanPosition, isLoading: isLoadingLoanPosition } = useLoanPosition({
    loanId: loan.id,
  })
  console.log('loanPosition', loanPosition)

  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid repayment amount',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert the amount to token decimals (6 decimals for KESN)
      const amountInTokenDecimals = toTokenDecimals(parseFloat(repayAmount), 6)

      const result = await repayBorrow({
        wallet: walletId,
        loan: loan.id,
        amount: amountInTokenDecimals,
      })

      if (result.success) {
        // Invalidate loan position queries to refetch updated data
        await queryClient.invalidateQueries({
          queryKey: [...cradleQueryKeys.loans.byId(loan.id), 'position'],
        })
        // Also invalidate loans list to update the portfolio page
        await queryClient.invalidateQueries({
          queryKey: cradleQueryKeys.loans.listByWallet(walletId),
        })

        // Invalidate asset balances for both reserve asset (borrowed) and collateral asset
        // Reserve asset balance decreases (repayment amount)
        if (asset?.id) {
          await queryClient.invalidateQueries({
            queryKey: cradleQueryKeys.balances.byWalletAndAsset(walletId, asset.id),
          })
        }
        // Collateral asset balance may change (returned if fully repaid)
        await queryClient.invalidateQueries({
          queryKey: cradleQueryKeys.balances.byWalletAndAsset(walletId, loan.collateral_asset),
        })

        toast({
          title: 'Repayment Successful',
          description: `Successfully repaid ${repayAmount} ${asset?.symbol || ''}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        })
        onClose()
        setRepayAmount('')
      } else {
        toast({
          title: 'Repayment Failed',
          description: result.error || 'Failed to process repayment',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        })
      }
    } catch (error) {
      console.error('Error repaying loan:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // KESN has 6 decimal places
  const currentDebt = loanPosition?.current_dept
    ? fromTokenDecimals(parseFloat(String(loanPosition.current_dept)), 6)
    : 0

  // Health factor is stored in 18 decimals (like Wei), so divide by 10^18
  const healthFactor = loanPosition?.health_factor
    ? parseFloat(String(loanPosition.health_factor)) / 1e18
    : 0

  const isHealthy = healthFactor >= 1
  const healthFactorColor = isHealthy ? 'green' : 'red'
  const healthFactorStatus = isHealthy ? 'Healthy' : 'At Risk'

  // Calculate progress percentage (health factor / 2.0 * 100, capped at 100%)
  // Using 2.0 as max for better visualization (health factor can go higher)
  const healthFactorProgress = Math.min((healthFactor / 2.0) * 100, 100)

  // Color coding: green >= 1.0, yellow 0.5-1.0, red < 0.5
  const getHealthFactorProgressColor = () => {
    if (healthFactor >= 1.0) return 'green'
    if (healthFactor >= 0.5) return 'yellow'
    return 'red'
  }

  const handleMaxClick = () => {
    if (currentDebt > 0) {
      setRepayAmount(currentDebt.toString())
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Repay Loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box bg="bg.muted" borderRadius="md">
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  Current Debt
                </Text>
                {isLoadingLoanPosition ? (
                  <Skeleton h="24px" w="120px" />
                ) : (
                  <HStack spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {formatNumberWithCommas(currentDebt, 2)}
                    </Text>
                    <Text color="font.secondary" fontSize="sm" fontWeight="medium">
                      {asset?.symbol || ''}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            {/* Health Factor */}
            <Box bg="bg.muted" borderRadius="md" py={4}>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Health Factor
                  </Text>
                  {!isLoadingLoanPosition && (
                    <Badge colorScheme={healthFactorColor} fontSize="xs" px={2} py={1}>
                      {healthFactorStatus}
                    </Badge>
                  )}
                </HStack>
                {isLoadingLoanPosition ? (
                  <Skeleton h="24px" w="full" />
                ) : (
                  <>
                    <VStack align="stretch" spacing={1}>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          {healthFactor.toFixed(2)}
                        </Text>
                        <Text color="font.secondary" fontSize="xs">
                          {isHealthy
                            ? "You're safe from liquidation"
                            : 'Warning: Your position may be liquidated'}
                        </Text>
                      </HStack>
                      <Progress
                        colorScheme={getHealthFactorProgressColor()}
                        hasStripe={!isHealthy}
                        isAnimated={!isHealthy}
                        size="md"
                        value={healthFactorProgress}
                      />
                    </VStack>
                  </>
                )}
              </VStack>
            </Box>

            <FormControl>
              <FormLabel>Repayment Amount</FormLabel>
              <HStack>
                <Input
                  onChange={e => setRepayAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  value={repayAmount}
                />
                <Button onClick={handleMaxClick} size="sm" variant="outline">
                  MAX
                </Button>
              </HStack>
              <FormHelperText>Enter the amount you want to repay</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            isDisabled={!repayAmount || parseFloat(repayAmount) <= 0 || isSubmitting}
            isLoading={isSubmitting}
            onClick={handleRepay}
            variant="primary"
          >
            Repay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
