import { createContext, useContext } from 'react'

export type EnvironmentContextValue = Required<
  Pick<
    NodeJS.ProcessEnv,
    'API_URL' | 'API_URL_V2' | 'ENV' | 'LOCALHOST_PLAUSIBLE_TRACKING'
  >
>

export const ENVIRONMENT_CONTEXT_DEFAULT_VALUE: EnvironmentContextValue = {
  API_URL:
    'https://graphql-cryoet-api.cryoet.prod.si.czi.technology/v1/graphql',
  API_URL_V2: 'https://graphql.cryoet.staging.si.czi.technology/graphql', // TODO(bchu): Set to prod.
  ENV: 'local',
  LOCALHOST_PLAUSIBLE_TRACKING: 'false',
}

export const EnvironmentContext = createContext<EnvironmentContextValue>(
  ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
)

export function useEnvironment() {
  return useContext(EnvironmentContext)
}
