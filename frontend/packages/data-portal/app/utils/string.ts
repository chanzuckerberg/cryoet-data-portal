import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) {
    return '0'
  }
  return value.toLocaleString()
}
