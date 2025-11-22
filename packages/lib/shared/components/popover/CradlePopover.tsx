import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  PlacementWithLogical,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type CradlePopoverProps = {
  text: string
  placement?: PlacementWithLogical
}

export function CradlePopover({
  children,
  text,
  placement = 'right',
}: PropsWithChildren<CradlePopoverProps>) {
  return (
    <Popover placement={placement} trigger="hover">
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent maxW="300px" p="sm" w="auto">
        <Text fontSize="sm" variant="secondary">
          {text}
        </Text>
      </PopoverContent>
    </Popover>
  )
}
