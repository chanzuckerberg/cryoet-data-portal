declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_URL?: string
    readonly API_URL_V2?: string
    readonly CLOUDWATCH_RUM_APP_ID?: string
    readonly CLOUDWATCH_RUM_APP_NAME?: string
    readonly CLOUDWATCH_RUM_IDENTITY_POOL_ID?: string
    readonly CLOUDWATCH_RUM_ROLE_ARN?: string
    readonly E2E_BROWSER?: string
    readonly E2E_CONFIG: string
    readonly ENV: 'local' | 'dev' | 'staging' | 'prod'
    readonly LOCALHOST_PLAUSIBLE_TRACKING: 'true' | 'false'
  }
}

declare module 'remark-sectionize' {
  const plugin: import('unified').Pluggable
  // eslint-disable-next-line import/no-default-export
  export default plugin
}
