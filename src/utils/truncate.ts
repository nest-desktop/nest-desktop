// truncate.ts

/**
 * Truncate long text
 * @param value string
 * @param size number (default: 6)
 * @returns string
 */
export function truncate(value: string, size: number = 6): string {
  return value.slice(0, size);
}
