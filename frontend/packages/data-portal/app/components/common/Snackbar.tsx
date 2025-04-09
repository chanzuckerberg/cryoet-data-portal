import { Notification } from '@czi-sds/components'
import { cns } from 'app/utils/cns'

interface SnackbarProps {
  open: boolean
  title: string
  intent?: 'info' | 'negative' | 'positive' | 'notice'
  description?: string
  className?: string
}

const Snackbar = ({
  open,
  title,
  intent = 'info',
  description,
  className,
}: SnackbarProps) => {
  if (!open) {
    return null
  }

  return (
    <Notification
      intent={intent}
      className={cns(
        `absolute flex !items-center bottom-0 left-0 right-0 z-10 !border-l-0 
        !m-auto !mb-1 !py-2 !px-4 rounded !bg-white`,
        className,
      )}
      slideDirection="left"
    >
      <style>{`
        .MuiAlert-message {
          padding: 0 !important;
        }
        .MuiAlert-icon, .MuiAlert-icon .MuiSvgIcon-root {
          width: 1rem !important;
          height: 1rem !important;
        }
        .MuiAlert-standardSuccess .MuiAlert-icon {
          color: #1B9C4A;
        }
      `}</style>
      <p className="!font-semibold !m-0 p-0">{title}</p>
      {description}
    </Notification>
  )
}

export default Snackbar
