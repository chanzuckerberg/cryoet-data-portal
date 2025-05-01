import { useState, useEffect } from 'react'
import { Notification } from '@czi-sds/components'

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

const Snackbar = ({
  open,
  intent = 'info',
  title,
  message,
  className,
  handleClose,
  autoHideDuration = 8000
}: SnackbarProps) => {
  const [localOpen, setLocalOpen] = useState(open);

  useEffect(() => {
    setLocalOpen(open);
    
    if (open) {
      const timer = setTimeout(() => {
        setLocalOpen(false);
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, handleClose, autoHideDuration]);

  if (!localOpen) {
    return null;
  }

  return (
    <Notification
      intent={intent}
      slideDirection="right"
      autoDismiss={autoHideDuration}
      onClose={() => {
        setLocalOpen(false)
        handleClose();
      }}
      className={cns(
        "absolute bottom-0 left-3 z-10 !min-w-[392px]",
        className,
      )}
    >
      {title && <p className="!font-semibold !m-0 p-0">{title}</p>}
      {message}
    </Notification>
  )
}

export default Snackbar;
