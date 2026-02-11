import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects the locale from a pathname string
 * @param pathname - The pathname from the URL (e.g., '/en/dashboard')
 * @returns The detected locale ('en' or 'nl'), defaults to 'en' if not found or invalid
 */
export function detectLocaleFromPathname(pathname: string): 'en' | 'nl' {
  const locale = pathname.split('/')[1];
  return locale && ['en', 'nl'].includes(locale) 
    ? (locale as 'en' | 'nl')
    : 'en';
}
