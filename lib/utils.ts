export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function clamp01(value: number) {
  return clamp(value, 0, 1)
}

export function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0
  const result = index % length
  return result < 0 ? result + length : result
}
