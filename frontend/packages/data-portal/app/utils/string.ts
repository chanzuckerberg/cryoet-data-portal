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

// Helper functions for multi-select string handling
export const stringToArray = (value: string): string[] => {
  return value ? value.split(',').filter(Boolean) : []
}

export const arrayToString = (array: string[]): string => {
  return array.join(',')
}

export function formatNumber(value: number | undefined): string {
  if (value === undefined) {
    return '0'
  }
  return value.toLocaleString()
}
