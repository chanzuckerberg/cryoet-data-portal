// Route config is only evaluated at build time, so these are dev dependencies.
// eslint-disable-next-line import/no-extraneous-dependencies
import { flatRoutes } from '@remix-run/fs-routes'
import type { RouteConfig } from '@remix-run/route-config'

// eslint-disable-next-line import/no-default-export
export default flatRoutes() satisfies RouteConfig
