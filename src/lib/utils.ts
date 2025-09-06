import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFactName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStatusColor(isInconsistent: boolean): string {
  return isInconsistent ? 'text-yellow-600' : 'text-green-600';
}

export function getStatusIcon(isInconsistent: boolean): string {
  return isInconsistent ? '⚠️' : '✅';
}
