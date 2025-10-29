'use client'

import {
  Box,
  BoxProps,
  Button,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
  Text,
  VStack,
  forwardRef,
} from '@chakra-ui/react'
import { blockInvalidNumberInput } from '@repo/lib/shared/utils/numbers'
import { TokenIcon } from '../TokenIcon'
import { ChevronDown } from 'react-feather'
import { ApiToken, CustomToken } from '../token.types'

type TokenInputSelectorProps = {
  token: ApiToken | CustomToken | undefined
  onToggleTokenClicked?: () => void
}

export function TokenInputSelector({ token, onToggleTokenClicked }: TokenInputSelectorProps) {
  const DEFAULT_TOKEN_LABEL = 'Select token'
  const tokenLabel = token?.symbol || DEFAULT_TOKEN_LABEL
  const tokenSymbolColor = token ? 'font.primary' : 'font.dark'

  return (
    <Button
      aria-label={tokenLabel}
      cursor={onToggleTokenClicked ? 'pointer' : 'default'}
      justifyContent="space-between"
      onClick={() => onToggleTokenClicked?.()}
      variant={token ? 'tertiary' : 'secondary'}
      width="full"
    >
      <HStack spacing="sm">
        {token && (
          <Box>
            <TokenIcon alt={tokenLabel} logoURI={token?.logoURI} size={22} />
          </Box>
        )}
        <Text color={tokenSymbolColor} fontWeight="bold">
          {tokenLabel}
        </Text>
      </HStack>
      {onToggleTokenClicked && (
        <Box ml="sm">
          <ChevronDown size={16} />
        </Box>
      )}
    </Button>
  )
}

type Props = {
  address?: string
  apiToken?: ApiToken | CustomToken
  chain?: string | number
  weight?: string
  value?: string
  boxProps?: BoxProps
  onChange?: (event: { currentTarget: { value: string } }) => void
  onToggleTokenClicked?: () => void
  priceMessage?: string
  customUserBalance?: string
  customUsdPrice?: number
}

export const TokenInput = forwardRef(
  (
    {
      apiToken,
      value,
      boxProps,
      onChange,
      onToggleTokenClicked,
      ...inputProps
    }: InputProps & Props,
    ref
  ) => {
    const token = apiToken

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value
      if (onChange) {
        onChange({ currentTarget: { value: newValue } })
      }
    }

    return (
      <Box
        bg="background.level0"
        border="white"
        borderRadius="md"
        p={['ms', 'md']}
        shadow="innerBase"
        w="full"
        {...boxProps}
      >
        <VStack align="start" spacing="md">
          <InputGroup background="transparent" border="transparent">
            <Box position="relative" w="full">
              <Input
                _focus={{
                  outline: 'none',
                  border: '0px solid transparent',
                  boxShadow: 'none',
                }}
                _hover={{
                  border: '0px solid transparent',
                  boxShadow: 'none',
                }}
                autoComplete="off"
                autoCorrect="off"
                bg="transparent"
                border="0px solid transparent"
                boxShadow="none"
                fontSize="3xl"
                fontWeight="medium"
                isDisabled={!token}
                min={0}
                onChange={handleOnChange}
                onKeyDown={blockInvalidNumberInput}
                onWheel={e => {
                  // Avoid changing the input value when scrolling
                  return e.currentTarget.blur()
                }}
                outline="none"
                p="0"
                placeholder="0.00"
                ref={ref}
                shadow="none"
                step="any"
                type="number"
                value={value}
                {...inputProps}
              />
              {token && (
                <Box
                  bgGradient="linear(to-r, transparent, background.level0 70%)"
                  h="full"
                  position="absolute"
                  right={0}
                  top={0}
                  w="8"
                  zIndex={9999}
                />
              )}
            </Box>

            <InputRightAddon bg="transparent" border="none" p="0" pl="1">
              <TokenInputSelector onToggleTokenClicked={onToggleTokenClicked} token={token} />
            </InputRightAddon>
          </InputGroup>

          <HStack h="4" justify="space-between" w="full">
            <Text color="font.secondary" fontSize="sm" opacity={0.5} variant="secondary">
              $0.00
            </Text>
            <Text color="font.secondary" fontSize="sm">
              Balance: 0.00
            </Text>
          </HStack>
        </VStack>
      </Box>
    )
  }
)
