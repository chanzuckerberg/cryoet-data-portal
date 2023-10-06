import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cns(...values: ClassValue[]): string {
  return twMerge(clsx(...values))
}
