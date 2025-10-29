'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { CreditCard } from 'react-feather'
import ButtonGroup, { ButtonGroupOption } from '../btns/button-group/ButtonGroup'
import { SelectInput, SelectOption } from '../inputs/SelectInput'

export enum CashMode {
  PAY = 'pay',
  FUND_WALLET = 'fund-wallet',
}

export enum PaymentType {
  MOBILE_NUMBER = 'mobile-number',
  PAYBILL = 'paybill',
  BUY_GOODS = 'buy-goods',
}

interface MobileMoneyFormProps {
  mode: CashMode
  onModeChange: (mode: CashMode) => void
}

export function MobileMoneyForm({ mode, onModeChange }: MobileMoneyFormProps) {
  const [selectedCountry, setSelectedCountry] = useState('kenya')
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.MOBILE_NUMBER)
  const [mobileNetwork, setMobileNetwork] = useState('safaricom')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')

  const modeOptions: ButtonGroupOption[] = [
    { value: CashMode.PAY, label: 'Pay' },
    { value: CashMode.FUND_WALLET, label: 'Fund Wallet' },
  ]

  const countryOptions: SelectOption[] = [
    { value: 'kenya', label: '🇰🇪 Kenya (KES)' },
    { value: 'uganda', label: '🇺🇬 Uganda (UGX)' },
    { value: 'tanzania', label: '🇹🇿 Tanzania (TZS)' },
  ]

  const networkOptions: SelectOption[] = [
    { value: 'safaricom', label: 'Safaricom' },
    { value: 'airtel', label: 'Airtel' },
    { value: 'equitel', label: 'Equitel' },
  ]

  const paymentTypeOptions: ButtonGroupOption[] = [
    { value: PaymentType.MOBILE_NUMBER, label: 'Mobile Number' },
    { value: PaymentType.PAYBILL, label: 'Paybill' },
    { value: PaymentType.BUY_GOODS, label: 'Buy Goods' },
  ]

  const tokenOptions: SelectOption[] = [
    { value: 'apt', label: 'APT' },
    { value: 'usdc', label: 'USDC' },
    { value: 'usdt', label: 'USDT' },
  ]

  const handleModeChange = (option: ButtonGroupOption) => {
    onModeChange(option.value as CashMode)
  }

  const handlePaymentTypeChange = (option: ButtonGroupOption) => {
    setPaymentType(option.value as PaymentType)
  }

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', {
      mode,
      selectedCountry,
      paymentType,
      mobileNetwork,
      phoneNumber,
      amount,
    })
  }

  const isFundWallet = mode === CashMode.FUND_WALLET
  const buttonText = isFundWallet ? 'Buy APT' : 'Send Money'
  const title = isFundWallet ? 'Fund wallet' : 'Pay'

  return (
    <Card maxW="md" mx="auto" rounded="xl">
      <CardHeader>
        <VStack align="stretch" spacing={4}>
          {/* Mode Tabs */}
          <HStack align="center" justify="space-between">
            <ButtonGroup
              currentOption={modeOptions.find(opt => opt.value === mode)}
              groupId="cash-mode-tabs"
              onChange={handleModeChange}
              options={modeOptions}
              size="sm"
            />

            {/* Token Selector */}
            <Box minW="120px">
              <SelectInput
                id="token-selector"
                isSearchable={false}
                onChange={() => {}}
                options={tokenOptions}
                value="apt"
              />
            </Box>
          </HStack>

          {/* Title */}
          <Text color="font.primary" fontSize="2xl" fontWeight="bold">
            {title}
          </Text>

          {/* Wallet Connection Banner */}
          {isFundWallet && (
            <Box bg="yellow.500" color="white" p={3} rounded="md" textAlign="center">
              <Text fontSize="sm" fontWeight="medium">
                Please connect your wallet to proceed
              </Text>
            </Box>
          )}
        </VStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Country Selection */}
          <FormControl>
            <FormLabel color="font.primary" fontSize="sm" fontWeight="medium">
              Select Country
            </FormLabel>
            <SelectInput
              id="country-selector"
              isSearchable={false}
              onChange={setSelectedCountry}
              options={countryOptions}
              value={selectedCountry}
            />
          </FormControl>

          {/* Payment Type Selection (only for Pay mode) */}
          {!isFundWallet && (
            <FormControl>
              <FormLabel color="font.primary" fontSize="sm" fontWeight="medium">
                Payment Type
              </FormLabel>
              <ButtonGroup
                currentOption={paymentTypeOptions.find(opt => opt.value === paymentType)}
                groupId="payment-type-tabs"
                onChange={handlePaymentTypeChange}
                options={paymentTypeOptions}
                size="sm"
              />
            </FormControl>
          )}

          {/* Mobile Network */}
          <FormControl>
            <FormLabel color="font.primary" fontSize="sm" fontWeight="medium">
              Mobile Network
            </FormLabel>
            <SelectInput
              id="network-selector"
              isSearchable={false}
              onChange={setMobileNetwork}
              options={networkOptions}
              value={mobileNetwork}
            />
          </FormControl>

          {/* Phone Number */}
          <FormControl>
            <FormLabel color="font.primary" fontSize="sm" fontWeight="medium">
              {isFundWallet ? 'M-Pesa Phone Number' : 'Phone Number'}
            </FormLabel>
            <HStack spacing={2}>
              <Button leftIcon={<CreditCard size={16} />} minW="80px" size="sm" variant="tertiary">
                Select
              </Button>
              <Input
                _focus={{
                  bg: 'input.bgFocus',
                  borderColor: 'input.borderFocus',
                }}
                _hover={{
                  bg: 'input.bgHover',
                  borderColor: 'input.borderHover',
                }}
                bg="input.bgDefault"
                border="1px solid"
                borderColor="input.borderDefault"
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder={isFundWallet ? '0799770833' : '0712345678'}
                value={phoneNumber}
              />
            </HStack>
          </FormControl>

          {/* Amount Input */}
          <FormControl>
            <FormLabel color="font.primary" fontSize="sm" fontWeight="medium">
              Enter Amount in KES
            </FormLabel>
            <InputGroup>
              <InputLeftElement>
                <Text color="font.primary" fontSize="lg" fontWeight="bold">
                  KES
                </Text>
              </InputLeftElement>
              <Input
                _focus={{
                  bg: 'input.bgFocus',
                  borderColor: 'input.borderFocus',
                }}
                _hover={{
                  bg: 'input.bgHover',
                  borderColor: 'input.borderHover',
                }}
                bg="input.bgDefault"
                border="1px solid"
                borderColor="input.borderDefault"
                fontSize="lg"
                onChange={e => setAmount(e.target.value)}
                pl="60px"
                placeholder="0"
                value={amount}
              />
            </InputGroup>
          </FormControl>

          {/* Submit Button */}
          <Button mt={4} onClick={handleSubmit} size="lg" variant="primary" w="full">
            {buttonText}
          </Button>

          {/* Limits */}
          <Text color="font.secondary" fontSize="xs" textAlign="center">
            Minimum: 20 KES • Maximum: 250,000 KES
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )
}
