import type { RouteConfig } from '@react-router/dev/routes'
// Route config is only evaluated at build time, so these are dev dependencies.
// eslint-disable-next-line import/no-extraneous-dependencies
import { flatRoutes } from '@react-router/fs-routes'

// eslint-disable-next-line import/no-default-export
export default flatRoutes() satisfies RouteConfig
