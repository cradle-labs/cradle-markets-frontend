import { AlertLink } from '@repo/lib/shared/components/alerts/AlertLink'
import { getDiscordLink } from '@repo/lib/shared/utils/links'

export function DiscordLink() {
  const discordUrl = getDiscordLink()
  return (
    <AlertLink href={discordUrl} isExternal>
      our discord
    </AlertLink>
  )
}
