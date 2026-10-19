import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Anchored to REQ-FND-001, REQ-FND-002
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
