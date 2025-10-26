import { Button, Flex, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { Repeat } from 'react-feather'

interface ReversedToggleButtonProps {
  toggleIsReversed: () => void
  tokenPair: string
}

export function ReversedToggleButton({ toggleIsReversed, tokenPair }: ReversedToggleButtonProps) {
  return (
    <Button
      cursor="pointer"
      fontSize="xs"
      fontWeight="medium"
      height="28px !important"
      minWidth="auto"
      ml={0.5}
      onClick={toggleIsReversed}
      px="2"
      py="0 !important"
      rounded="sm !important"
      shadow="md"
      size="xs"
      variant="tertiary"
      width="auto"
    >
      <Flex alignItems="center" gap="1.5">
        <Icon as={Repeat} />
        <Text fontSize="xs" fontWeight="medium">
          {tokenPair}
        </Text>
      </Flex>
    </Button>
  )
}
