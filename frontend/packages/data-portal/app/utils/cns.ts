import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cns(...values: ClassValue[]): string {
  return twMerge(clsx(...values))
}

export function cnsNoMerge(...values: ClassValue[]): string {
  return clsx(...values)
}
