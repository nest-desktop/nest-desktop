// slice.ts

export function truncate(value?: string, size: number = 6) {
  return !value ? value : value.slice(0, size);
}
