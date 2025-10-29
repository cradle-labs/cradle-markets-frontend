import { type ThemeConfig } from '@chakra-ui/react'

export const DEFAULT_THEME_COLOR_MODE = 'dark'

// Cannot me named config to avoid deprecation error in turbopack mode
export const themeConfig: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const fonts = {
  heading: `inherit`,
  body: `inherit`,
}

export const styles = {
  global: {
    html: {
      scrollBehavior: 'smooth',
      overscrollBehaviorY: 'none',
    },
    'body > div[data-rk]': {
      minHeight: '100vh',
    },
    body: {
      background: 'background.base',
    },
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
    },
    '::-webkit-scrollbar-thumb': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease-in-out',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '16px',
      _dark: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
      },
    },
    '::-webkit-scrollbar-thumb:hover': {
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      _dark: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
      },
    },
    'p + ul': {
      mt: '1',
    },
  },
}
