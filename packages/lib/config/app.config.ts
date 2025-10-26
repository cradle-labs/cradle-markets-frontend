import { Config} from './config.types'

if (!process.env.NEXT_PUBLIC_CRADLE_API_URL) {
  throw new Error(
    `NEXT_PUBLIC_CRADLE_API_URL is missing in your .env vars.
    Please follow the instructions to create .env.local from README.md`
  )
}

export const config: Config = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV as Config['appEnv']) || 'dev',
  apiUrl: process.env.NEXT_PUBLIC_CRADLE_API_URL,
}

export const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'dev'
export const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'prod'
export const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging'
/*
  Used by E2E dev tests to setup wagmi config to use an anvil fork
  It is also recommended to set NEXT_PUBLIC_E2E_DEV when using Rivet
*/
export const shouldUseAnvilFork = !!process.env.NEXT_PUBLIC_E2E_DEV
