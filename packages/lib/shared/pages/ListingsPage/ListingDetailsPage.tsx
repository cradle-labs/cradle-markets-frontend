'use client'

import { useMemo } from 'react'
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Grid,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { ChevronRight, Home, ExternalLink, FileText } from 'react-feather'
import { useUser } from '@clerk/nextjs'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAsset } from '@repo/lib/cradle-client-ts/hooks/assets/useAsset'
import { useListing } from '@repo/lib/cradle-client-ts/hooks/listings/useListing'
import { useListingStats } from '@repo/lib/cradle-client-ts/hooks/listings/useListings'
import { ListingMetricsGrid, ListingPurchasePanel } from '@repo/lib/modules/listings'

interface ListingDetailsPageProps {
  listingId: string
}

export function ListingDetailsPage({ listingId }: ListingDetailsPageProps) {
  const { user } = useUser()

  // Get the account using the Clerk user ID
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  // Fetch wallet for the account
  const { data: wallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  // Fetch listing data
  const {
    data: listing,
    isLoading: isLoadingListing,
    refetch: refetchListing,
  } = useListing({ listingId })

  // Fetch listing stats
  const {
    data: listingStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useListingStats({
    listingId,
    enabled: !!listing,
  })

  // Fetch listed asset details
  const { data: listedAsset, isLoading: isLoadingListedAsset } = useAsset({
    assetId: listing?.listed_asset || '',
    enabled: !!listing?.listed_asset,
  })

  // Fetch purchase asset details
  const { data: purchaseAsset, isLoading: isLoadingPurchaseAsset } = useAsset({
    assetId: listing?.purchase_with_asset || '',
    enabled: !!listing?.purchase_with_asset,
  })

  // Combine all data
  const listingData = useMemo(() => {
    if (!listing) return null

    return {
      ...listing,
      listedAsset,
      purchaseAsset,
      stats: listingStats,
    }
  }, [listing, listedAsset, purchaseAsset, listingStats])

  const fallbackBg = useColorModeValue('gray.100', 'gray.700')
  const fallbackColor = useColorModeValue('gray.600', 'gray.300')

  const statusColorMap: Record<string, string> = {
    open: 'green',
    pending: 'yellow',
    closed: 'gray',
    paused: 'orange',
    cancelled: 'red',
  }

  // Loading state
  const isLoading =
    isLoadingListing || isLoadingStats || isLoadingListedAsset || isLoadingPurchaseAsset

  if (isLoading) {
    return (
      <DefaultPageContainer>
        <Box alignItems="center" display="flex" justifyContent="center" minH="400px">
          <Spinner size="xl" />
        </Box>
      </DefaultPageContainer>
    )
  }

  // Error/Not found state
  if (!listingData) {
    return (
      <DefaultPageContainer>
        <Box py="20">
          <Heading size="lg" textAlign="center">
            Listing not found
          </Heading>
          <Text color="text.secondary" mt="4" textAlign="center">
            The listing you're looking for doesn't exist.
          </Text>
        </Box>
      </DefaultPageContainer>
    )
  }

  const handleTransactionSuccess = () => {
    refetchListing()
    refetchStats()
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      {/* Header Section */}
      <Box borderBottom="1px solid" borderColor="border.base">
        <Noise
          backgroundColor="background.level0WithOpacity"
          overflow="hidden"
          position="relative"
          shadow="innerBase"
        >
          <DefaultPageContainer
            pb={['xl', 'xl', '10']}
            pr={{ base: '0 !important', md: 'md !important' }}
            pt={['xl', '40px']}
          >
            <Box display={{ base: 'none', md: 'block' }}>
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                padding="15px"
                position="absolute"
                right={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                top="40px"
                width={1000}
              />
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                left={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                padding="15px"
                position="absolute"
                top="40px"
                width={1000}
              />
            </Box>
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="-300px"
              width={600}
            />
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="300px"
              width={600}
            />
            <FadeInOnView animateOnce={false}>
              <VStack align="stretch" mb="8" spacing="4">
                {/* Breadcrumbs */}
                <Breadcrumb
                  color="grayText"
                  fontSize="sm"
                  pb="ms"
                  separator={
                    <Box color="border.base">
                      <ChevronRight size={16} />
                    </Box>
                  }
                  spacing="sm"
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Button color="grayText" size="xs" variant="link">
                        <Home size={16} />
                      </Button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink fontWeight="medium" href="/listings">
                      Listings
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">
                      {listingData.listedAsset?.symbol || listingData.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>

                {/* Header Content */}
                <HStack spacing="4">
                  <Box borderRadius="full" flexShrink={0} h="60px" overflow="hidden" w="60px">
                    {listingData.listedAsset?.icon ? (
                      <Image
                        alt={`${listingData.listedAsset.name} logo`}
                        fallback={
                          <Box
                            alignItems="center"
                            bg={fallbackBg}
                            borderRadius="full"
                            display="flex"
                            h="full"
                            justifyContent="center"
                            w="full"
                          >
                            <Text color={fallbackColor} fontSize="xl" fontWeight="bold">
                              {listingData.listedAsset?.symbol?.charAt(0).toUpperCase() || 'L'}
                            </Text>
                          </Box>
                        }
                        h="full"
                        objectFit="contain"
                        src={listingData.listedAsset.icon ?? undefined}
                        w="full"
                      />
                    ) : (
                      <Box
                        alignItems="center"
                        bg={fallbackBg}
                        borderRadius="full"
                        display="flex"
                        h="full"
                        justifyContent="center"
                        w="full"
                      >
                        <Text color={fallbackColor} fontSize="xl" fontWeight="bold">
                          {listingData.listedAsset?.symbol?.charAt(0).toUpperCase() || 'L'}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box flex={1}>
                    <HStack spacing={3}>
                      <Heading size="xl">{listingData.name}</Heading>
                      <Badge
                        colorScheme={statusColorMap[listingData.status] || 'gray'}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {listingData.status.charAt(0).toUpperCase() + listingData.status.slice(1)}
                      </Badge>
                    </HStack>
                    <HStack mt="2" spacing="3">
                      <Badge colorScheme="purple" fontSize="sm">
                        {listingData.listedAsset?.symbol}
                      </Badge>
                      <Text color="text.secondary" fontSize="sm">
                        {listingData.listedAsset?.name}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>

                {/* Description */}
                <Text color="text.secondary" fontSize="md" maxW="800px">
                  {listingData.description}
                </Text>
              </VStack>
            </FadeInOnView>
          </DefaultPageContainer>
        </Noise>
      </Box>

      {/* Main Content */}
      <DefaultPageContainer
        noVerticalPadding
        pb="xl"
        pr={{ base: '0 !important', xl: 'md !important' }}
        pt={['lg', '54px']}
      >
        {/* Key Metrics Grid */}
        <ListingMetricsGrid
          maxSupply={listingData.max_supply}
          purchaseAssetDecimals={
            listingData.purchaseAsset?.decimals != null
              ? Number(listingData.purchaseAsset.decimals)
              : undefined
          }
          purchaseAssetSymbol={listingData.purchaseAsset?.symbol}
          purchasePrice={listingData.purchase_price}
          stats={listingData.stats}
          status={listingData.status}
        />

        {/* Listing Details and Purchase Panel */}
        <Grid gap="6" mb="8" templateColumns={{ base: '1fr', lg: '2fr 1fr' }}>
          {/* Listing Information Card */}
          <Card rounded="xl">
            <Box p={6}>
              <VStack align="start" spacing={5}>
                {/* About Section */}
                <VStack align="start" spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold">
                    About {listingData.name}
                  </Text>
                  <Text color="font.secondary" fontSize="sm" lineHeight="1.6">
                    {listingData.description}
                  </Text>
                </VStack>

                {/* Issuer Information */}
                <VStack align="start" pt={2} spacing={2} w="full">
                  <Text fontSize="sm" fontWeight="semibold">
                    Issuer Information
                  </Text>
                  <Box bg="background.level1" borderRadius="md" p={3} w="full">
                    <VStack align="start" spacing={2}>
                      <Text color="font.secondary" fontSize="xs">
                        <Text as="span" fontSize="sm" fontWeight="semibold">
                          Smart Contract:
                        </Text>{' '}
                        {listingData.listing_contract_id}
                      </Text>
                    </VStack>
                  </Box>
                </VStack>

                {/* Offering Details */}
                <VStack align="start" pt={4} spacing={3} w="full">
                  <Text fontSize="md" fontWeight="semibold">
                    Offering Details
                  </Text>

                  <Box
                    display="grid"
                    gap={4}
                    gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                    w="full"
                  >
                    <VStack align="start" spacing={1}>
                      <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                        Token
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {listingData.listedAsset?.symbol} ({listingData.listedAsset?.name})
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                        Payment Currency
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {listingData.purchaseAsset?.symbol || 'USD'}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                        Status
                      </Text>
                      <Badge
                        colorScheme={statusColorMap[listingData.status] || 'gray'}
                        fontSize="xs"
                      >
                        {listingData.status.charAt(0).toUpperCase() + listingData.status.slice(1)}
                      </Badge>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                        Listed
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatDate(listingData.created_at)}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                        Offering Start
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatDate(listingData.opened_at)}
                      </Text>
                    </VStack>

                    {listingData.stopped_at && (
                      <VStack align="start" spacing={1}>
                        <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                          Offering End
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatDate(listingData.stopped_at)}
                        </Text>
                      </VStack>
                    )}
                  </Box>
                </VStack>

                {/* Documents Button */}
                {listingData.documents && (
                  <Button
                    as="a"
                    href={listingData.documents}
                    leftIcon={<FileText size={18} />}
                    mt={2}
                    rightIcon={<ExternalLink size={14} />}
                    size="sm"
                    target="_blank"
                    variant="outline"
                  >
                    Offering Documents
                  </Button>
                )}
              </VStack>
            </Box>
          </Card>

          {/* Purchase Panel */}
          <ListingPurchasePanel
            assetName={listingData.listedAsset?.name}
            assetSymbol={listingData.listedAsset?.symbol}
            listingId={listingData.id}
            onPurchaseSuccess={handleTransactionSuccess}
            purchaseAssetDecimals={
              listingData.purchaseAsset?.decimals != null
                ? Number(listingData.purchaseAsset.decimals)
                : undefined
            }
            purchaseAssetId={listingData.purchaseAsset?.id}
            purchaseAssetSymbol={listingData.purchaseAsset?.symbol}
            purchasePrice={listingData.purchase_price}
            status={listingData.status}
            walletId={wallet?.id}
          />
        </Grid>
      </DefaultPageContainer>
    </>
  )
}
