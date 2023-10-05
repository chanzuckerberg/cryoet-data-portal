import {
  Button,
  ComplexFilter,
  DefaultDropdownMenuOption,
} from '@czi-sds/components'
import Typography from '@mui/material/Typography'
import type { MetaFunction } from '@remix-run/node'
import { useAtom } from 'jotai'

import { drawerOpenAtom } from 'app/state/drawer'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Remix Starter',
      description: 'Welcome to remix!',
    },
  ]
}

const OPTIONS: DefaultDropdownMenuOption[] = [
  { name: 'Filter Item 1', section: 'Section 1' },
  { name: 'Filter Item 2', section: 'Section 1' },
  { name: 'Filter Item 3', section: 'Section 2' },
]

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom)

  return (
    <div className="p-8 pt-24">
      <Button onClick={() => setDrawerOpen((prev) => !prev)}>
        {drawerOpen ? 'Close' : 'Open'} Drawer
      </Button>

      <Typography variant="h2" component="h1">
        Hello, CryoET Data Portal!
      </Typography>

      <ComplexFilter
        className="translate-x-[-6px] mt-sds-s"
        label="SDS Complex Filter"
        onChange={() => {}}
        options={OPTIONS}
        search
        DropdownMenuProps={{
          groupBy: (option: DefaultDropdownMenuOption) =>
            option.section as string,
        }}
      />
    </div>
  )
}
