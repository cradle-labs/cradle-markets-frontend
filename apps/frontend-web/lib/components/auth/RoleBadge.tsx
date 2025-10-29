'use client'

import { Badge, BadgeProps } from '@chakra-ui/react'
import { useRole } from '@/lib/hooks/useRole'

interface RoleBadgeProps extends Omit<BadgeProps, 'children'> {
  showRole?: boolean
}

export function RoleBadge({ showRole = true, ...props }: RoleBadgeProps) {
  const { role, isInstitution, isRetail } = useRole()

  if (!role || !showRole) {
    return null
  }

  const getColorScheme = () => {
    if (isInstitution) return 'blue'
    if (isRetail) return 'green'
    return 'gray'
  }

  const getDisplayText = () => {
    if (isInstitution) return 'Institution'
    if (isRetail) return 'Retail'
    return role
  }

  return (
    <Badge
      borderRadius="md"
      colorScheme={getColorScheme()}
      fontSize="xs"
      px={2}
      py={1}
      variant="subtle"
      {...props}
    >
      {getDisplayText()}
    </Badge>
  )
}
