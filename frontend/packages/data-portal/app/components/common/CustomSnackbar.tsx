import { CheckCircleOutlineOutlined } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'

type CustomSnackbarProps = {
  open: boolean
  variant?: 'filled' | 'outlined' | 'standard'
  severity?: 'error' | 'info' | 'success' | 'warning'
  message?: JSX.Element | string
  handleClose: (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => void
}

const styles = {
  width: '100%',
  padding: '1rem',
  alignItems: 'center',
  '& .MuiAlert-icon': {
    fontSize: '24px',
    padding: '0px',
  },
  '& .MuiAlert-message': {
    fontSize: '13px',
    lineHeight: '20px',
    padding: '0px',
  },
  '& .MuiAlert-action': {
    padding: '0px',
    marginLeft: '0.75rem',
    marginRight: '0px',
    '& .MuiIconButton-root': {
      padding: '0px',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  },
  '&.MuiAlert-filledSuccess': {
    backgroundColor: '#DAF4DE',
    borderLeft: '0.25rem solid #105B2B',
    '& .MuiAlert-icon': {
      color: '#105B2B',
    },
  },
}

export function CustomSnackbar({
  open,
  variant = 'standard',
  severity = 'info',
  message,
  handleClose,
}: CustomSnackbarProps) {
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        sx={styles}
        icon={
          severity === 'success' ? <CheckCircleOutlineOutlined /> : undefined
        }
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
