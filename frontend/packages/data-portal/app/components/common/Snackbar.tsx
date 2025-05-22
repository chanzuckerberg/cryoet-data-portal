import { Notification } from '@czi-sds/components'
import { useEffect, useState } from 'react'

import { cns } from 'app/utils/cns'

interface SnackbarProps {
  open: boolean
  intent?: 'info' | 'negative' | 'positive' | 'notice'
  title?: string
  message?: string
  className?: string
  handleClose: () => void
  autoHideDuration?: number
}

function Snackbar({
  open,
  intent = 'info',
  title,
  message,
  className,
  handleClose,
  autoHideDuration = 8000,
}: SnackbarProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    open && (
      <Notification
        intent={intent}
        slideDirection="right"
        autoDismiss={autoHideDuration}
        onClose={() => {
          handleClose()
        }}
        className={cns(
          'absolute bottom-0 left-3 z-10 !min-w-[392px]',
          className,
        )}
      >
        {title && <p className="!font-semibold !m-0 p-0">{title}</p>}
        {message}
      </Notification>
    )
  )
}

export default Snackbar
