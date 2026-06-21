export function pad2(n: number) {
  return String(n).padStart(2, "0")
}

export function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00"
  const s = Math.floor(sec)
  const m = Math.floor(s / 60)
  const rr = s % 60
  return `${m}:${String(rr).padStart(2, "0")}`
}
