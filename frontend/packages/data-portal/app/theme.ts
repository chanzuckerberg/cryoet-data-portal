import { makeThemeOptions, SDSAppTheme } from '@czi-sds/components'
import { createTheme } from '@mui/material/styles'

const appTheme = makeThemeOptions(SDSAppTheme)

export const theme = createTheme(appTheme)
