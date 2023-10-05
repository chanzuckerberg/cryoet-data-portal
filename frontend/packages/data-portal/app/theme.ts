import { defaultAppTheme, makeThemeOptions } from '@czi-sds/components'
import { createTheme } from '@mui/material/styles'

export const appTheme = makeThemeOptions(defaultAppTheme)

export const theme = createTheme(appTheme)
