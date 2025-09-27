// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes conditionally
 * (used by shadcn/ui for clean class handling)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
