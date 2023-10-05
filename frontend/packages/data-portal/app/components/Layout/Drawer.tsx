import Paper from '@mui/material/Paper'
import { useClickOutside } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useRef } from 'react'

import { Demo } from 'app/components/Demo'
import { drawerOpenAtom } from 'app/state/drawer'
import { theme } from 'app/theme'
import { cns } from 'app/utils/cns'

export function Drawer() {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom)
  const drawerRef = useRef<HTMLDivElement>(null)

  useClickOutside(drawerRef, () => setDrawerOpen(false))

  return (
    <>
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            ref={drawerRef}
            className={cns(
              'flex flex-auto min-w-[490px] bg-sds-gray-white',
              'z-20 fixed right-0',

              // 45px is the height of the top nav
              'top-[45px] h-[calc(100vh-45px)]',
            )}
            initial="hidden"
            animate="open"
            exit="hidden"
            variants={{
              hidden: { x: '100%' },
              open: { x: 0 },
            }}
            transition={{ duration: theme.transitions.duration.complex / 1000 }}
          >
            <Paper className="flex flex-auto" elevation={6}>
              <Demo>Drawer</Demo>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
