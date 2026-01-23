'use client'

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
  VStack,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SearchInput } from '@repo/lib/shared/components/inputs/SearchInput'
import { useMemo } from 'react'
import { Grid, List, Filter } from 'react-feather'
import { GroupBase, OptionBase, Select, SingleValue } from 'chakra-react-select'
import { getSelectStyles } from '@repo/lib/shared/services/chakra/custom/chakra-react-select'
import { useIsMounted } from '@repo/lib/shared/hooks/useIsMounted'

export type ViewMode = 'grid' | 'list'
export type AssetCategory = 'all' | 'equities' | 'forex'
export type SortOption =
  | 'most-popular'
  | 'price-asc'
  | 'price-desc'
  | 'change-asc'
  | 'change-desc'
  | 'volume-asc'
  | 'volume-desc'

interface AssetSearchFiltersProps {
  search: string | null
  setSearch: (search: string) => void
  selectedCategory: AssetCategory
  setSelectedCategory: (category: AssetCategory) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  isLoading?: boolean
}

const assetCategories: Array<{ value: AssetCategory; label: string }> = [
  { value: 'all', label: 'All assets' },
  { value: 'equities', label: 'Equities' },
  { value: 'forex', label: 'Forex' },
]

interface SortSelectOption extends OptionBase {
  label: string
  value: SortOption
}

const sortOptions: SortSelectOption[] = [
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'price-desc', label: 'Price (high to low)' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'change-desc', label: 'Change (best to worst)' },
  { value: 'change-asc', label: 'Change (worst to best)' },
  { value: 'volume-desc', label: 'Volume (high to low)' },
  { value: 'volume-asc', label: 'Volume (low to high)' },
]

function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <Button borderRadius="md" minW="40px" onClick={onClick} p={2} size="sm" variant="tertiary">
      <Filter size={16} />
    </Button>
  )
}

function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}) {
  return (
    <HStack bg="background.level1" borderRadius="md" h="48px" p={0} spacing={0} w="full">
      <Button
        borderBottomLeftRadius="md"
        borderBottomRightRadius="none"
        borderRadius="md"
        borderTopLeftRadius="md"
        borderTopRightRadius="none"
        colorScheme={viewMode === 'grid' ? 'primary' : 'gray'}
        flex={1}
        h="full"
        onClick={() => setViewMode('grid')}
        p={0}
        size="md"
        variant={viewMode === 'grid' ? 'solid' : 'ghost'}
      >
        <Grid size={20} />
      </Button>
      <Button
        borderBottomLeftRadius="none"
        borderBottomRightRadius="md"
        borderRadius="md"
        borderTopLeftRadius="none"
        borderTopRightRadius="md"
        colorScheme={viewMode === 'list' ? 'primary' : 'gray'}
        flex={1}
        h="full"
        onClick={() => setViewMode('list')}
        p={0}
        size="md"
        variant={viewMode === 'list' ? 'solid' : 'ghost'}
      >
        <List size={20} />
      </Button>
    </HStack>
  )
}

function CategoryFilters({
  selectedCategory,
  setSelectedCategory,
  onClose,
}: {
  selectedCategory: AssetCategory
  setSelectedCategory: (category: AssetCategory) => void
  onClose?: () => void
}) {
  return (
    <VStack align="stretch" spacing={3}>
      {assetCategories.map(category => (
        <Button
          borderRadius="md"
          colorScheme={selectedCategory === category.value ? 'primary' : 'gray'}
          fontSize="md"
          fontWeight="medium"
          h="48px"
          justifyContent="flex-start"
          key={category.value}
          onClick={() => {
            setSelectedCategory(category.value)
            onClose?.()
          }}
          size="md"
          variant={selectedCategory === category.value ? 'solid' : 'ghost'}
        >
          {category.label}
        </Button>
      ))}
    </VStack>
  )
}

function SortSelect({
  sortBy,
  setSortBy,
}: {
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}) {
  const isMounted = useIsMounted()
  const baseStyles = getSelectStyles<SortSelectOption>()

  const options = useMemo(() => sortOptions, [])

  function handleChange(newOption: SingleValue<SortSelectOption>) {
    if (newOption) setSortBy(newOption.value)
  }

  const value = options.find(option => option.value === sortBy)

  // Custom styles to override the selected option color
  const customStyles = useMemo(
    () => ({
      ...baseStyles,
      option: (provided: any, state: any) => ({
        ...baseStyles.option?.(provided, state),
        background: state.isSelected
          ? 'background.level0'
          : state.isFocused
            ? 'background.level3'
            : 'background.level4',
        color: state.isSelected ? 'white' : 'inherit',
        fontWeight: state.isSelected ? 'bold' : 'inherit',
        _hover: {
          background: state.isSelected ? 'background.level0' : 'background.level3',
          color: state.isSelected ? 'white' : 'inherit',
          fontWeight: state.isSelected ? 'bold' : 'inherit',
        },
      }),
    }),
    [baseStyles]
  )

  if (!isMounted) return null

  return (
    <Box w="full">
      <Select<SortSelectOption, false, GroupBase<SortSelectOption>>
        chakraStyles={customStyles}
        instanceId="asset-sort-select"
        isSearchable={false}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        onChange={handleChange}
        options={options}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
        }}
        value={value}
      />
    </Box>
  )
}

function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}: {
  isOpen: boolean
  onClose: () => void
  selectedCategory: AssetCategory
  setSelectedCategory: (category: AssetCategory) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}) {
  return (
    <Drawer
      closeOnEsc={true}
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="md"
    >
      <DrawerOverlay bg="blackAlpha.300" />
      <DrawerContent
        borderBottomRadius="none"
        borderTopRadius="2xl"
        maxH="80vh"
        mb={0}
        minH="60vh"
        mx={0}
      >
        <DrawerCloseButton />
        <DrawerHeader pb={2} px={4}>
          <Text fontSize="lg" fontWeight="bold">
            Filter
          </Text>
        </DrawerHeader>

        <DrawerBody overflowY="auto" pb={0} px={4}>
          <VStack align="stretch" spacing={6}>
            {/* Categories */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={4}>
                Asset Categories
              </Text>
              <CategoryFilters
                onClose={onClose}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </Box>

            {/* View Mode */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={4}>
                View
              </Text>
              <ViewToggle setViewMode={setViewMode} viewMode={viewMode} />
            </Box>

            {/* Sort */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={4}>
                Sort by
              </Text>
              <SortSelect setSortBy={setSortBy} sortBy={sortBy} />
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderColor="border.base" borderTop="1px solid" pb={4} px={4}>
          <HStack spacing={0} w="full">
            <Button
              borderBottomLeftRadius="md"
              borderBottomRightRadius="none"
              borderRadius="md"
              borderTopLeftRadius="md"
              borderTopRightRadius="none"
              colorScheme="gray"
              flex={1}
              h="48px"
              onClick={onClose}
              size="lg"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              borderBottomLeftRadius="none"
              borderBottomRightRadius="md"
              borderRadius="md"
              borderTopLeftRadius="none"
              borderTopRightRadius="md"
              colorScheme="primary"
              flex={1}
              h="48px"
              onClick={onClose}
              size="lg"
              variant="solid"
            >
              Confirm
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function AssetSearchFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  isLoading = false,
}: AssetSearchFiltersProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, lg: false })

  if (isMobile) {
    return (
      <>
        {/* Mobile Layout */}
        <HStack align="center" spacing={3}>
          {/* Search Input */}
          <Box flex={1}>
            <SearchInput
              ariaLabel="Search assets"
              isLoading={isLoading}
              placeholder="Search asset name or ticker"
              search={search}
              setSearch={setSearch}
            />
          </Box>

          {/* Filter Button */}
          <FilterButton onClick={onOpen} />
        </HStack>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      </>
    )
  }

  // Desktop Layout
  return (
    <VStack align="stretch" spacing={4}>
      {/* Search Input */}
      <SearchInput
        ariaLabel="Search assets"
        isLoading={isLoading}
        placeholder="Search asset name or ticker"
        search={search}
        setSearch={setSearch}
      />

      {/* Horizontal Filters and Controls */}
      <HStack align="center" justify="space-between" spacing={4}>
        {/* Category Filters */}
        <HStack flex={1} minW="0" overflowX="auto" spacing={2}>
          {assetCategories.map(category => (
            <Button
              borderRadius="full"
              colorScheme={selectedCategory === category.value ? 'primary' : 'gray'}
              flexShrink={0}
              fontSize="sm"
              fontWeight="medium"
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              size="sm"
              variant={selectedCategory === category.value ? 'solid' : 'ghost'}
            >
              {category.label}
            </Button>
          ))}
        </HStack>

        {/* View Toggle and Sort */}
        <HStack flexShrink={0} spacing={3}>
          <ViewToggle setViewMode={setViewMode} viewMode={viewMode} />

          <Box w="72">
            <SortSelect setSortBy={setSortBy} sortBy={sortBy} />
          </Box>
        </HStack>
      </HStack>
    </VStack>
  )
}
