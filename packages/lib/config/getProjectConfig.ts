import { ProjectConfigCradle } from './projects/cradle'
import { ProjectConfig } from './config.types'

const PROJECT_CONFIGS = {
  [ProjectConfigCradle.projectId]: ProjectConfigCradle,
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as ProjectConfig['projectId']

export const isCradle = projectId === ProjectConfigCradle.projectId
export const PROJECT_CONFIG = PROJECT_CONFIGS[projectId] ?? ProjectConfigCradle
