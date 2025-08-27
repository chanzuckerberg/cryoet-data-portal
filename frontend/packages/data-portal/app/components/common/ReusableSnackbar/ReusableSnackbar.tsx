import { CheckCircleOutlineOutlined } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'

import { cns } from 'app/utils/cns'

type ReusableSnackbarProps = {
  open?: boolean
  variant?: 'filled' | 'outlined' | 'standard'
  severity?: 'error' | 'info' | 'success' | 'warning'
  message?: JSX.Element | string
  handleClose?: (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => void
}

export function ReusableSnackbar({
  open,
  variant = 'standard',
  severity = 'info',
  message,
  handleClose,
}: ReusableSnackbarProps) {
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        classes={{
          root: 'w-full items-center !px-[16px] !py-[10px]',
          icon: 'p-0 text-[#105B2B]',
          message: 'text-[13px] leading-[20px] p-0',
          action: cns(
            'p-0 ml-12 mr-0 !px-[2px] !pt-[2px]',
            '[&_.MuiSvgIcon-root]:!text-[16px]',
          ),
          filledSuccess: '!bg-[#DAF4DE] border-l-4 border-[#105B2B]',
        }}
        icon={
          severity === 'success' ? <CheckCircleOutlineOutlined /> : undefined
        }
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
