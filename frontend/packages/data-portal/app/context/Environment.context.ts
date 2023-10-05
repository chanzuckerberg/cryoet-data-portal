import { createContext, useContext } from 'react'

export type EnvironmentContextValue = Required<
  Pick<NodeJS.ProcessEnv, 'API_URL' | 'ENV'>
>

export const ENVIRONMENT_CONTEXT_DEFAULT_VALUE: EnvironmentContextValue = {
  API_URL: 'https://graphql.cryoetdataportal.cziscience.com/v1/graphql',
  ENV: 'local',
}

export const EnvironmentContext = createContext<EnvironmentContextValue>(
  ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
)

export function useEnvironment() {
  return useContext(EnvironmentContext)
}
