import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'

import styles from './Overlay.module.css'

export function Overlay({
  children,
  onClick,
  open,
}: {
  children?: ReactNode
  onClick?(): void
  open: boolean
}) {
  useEffect(() => {
    const { body } = document

    if (open && !body.classList.contains(styles.noScroll)) {
      body.classList.add(styles.noScroll)
    } else if (!open && body.classList.contains(styles.noScroll)) {
      body.classList.remove(styles.noScroll)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-black/60 flex items-center fixed top-0 left-0 justify-center w-screen h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClick}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
