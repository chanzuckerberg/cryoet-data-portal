import { Callout } from '@czi-sds/components'
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
    <Callout
      intent={intent}
      className={cns(
        'absolute flex items-center bottom-0 !m-auto left-0 right-0 z-10 !py-2 !px-4 rounded !bg-white',
        className,
      )}
      autoDismiss={3000}
    >
      <p className="font-semibold">{title}</p>
      {description}
    </Callout>
  )
}

export default Snackbar
