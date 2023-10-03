import './main.css'
import './tailwind.css'

import { ThemeProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { theme } from './theme'

const node = document.querySelector('#root')
if (node) {
  const root = createRoot(node)
  root.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>,
  )
}
