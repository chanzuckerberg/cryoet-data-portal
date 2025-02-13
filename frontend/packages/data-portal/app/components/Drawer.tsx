import Paper from '@mui/material/Paper'
import { useClickOutside } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

import { theme } from 'app/theme'
import { cns } from 'app/utils/cns'

export function Drawer({
  children,
  className,
  onClose,
  open,
  PaperComponent = Paper,
}: {
  children: ReactNode
  className?: string
  onClose(): void
  open: boolean
  PaperComponent?: typeof Paper
}) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useClickOutside(drawerRef, onClose)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            className={cns(
              'flex flex-auto bg-sds-color-primitive-common-white',
              'max-w-[490px] min-w-[490px]',
              'z-20 absolute right-0',
              // 45px is the height of the top nav
              'h-[calc(100vh-45px)]',
              className,
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
            <PaperComponent
              className="flex flex-auto overflow-y-auto"
              elevation={10}
            >
              {children}
            </PaperComponent>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
