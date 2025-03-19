import { makeThemeOptions, SDSLightAppTheme } from '@czi-sds/components'
import { createTheme } from '@mui/material/styles'

const appTheme = makeThemeOptions(SDSLightAppTheme, 'light')

export const theme = createTheme(appTheme)
