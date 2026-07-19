"use client"

import { useEffect, useState } from "react"

const MOBILE_MOTION_QUERY = "(max-width: 639px), (hover: none) and (pointer: coarse)"

export function useMobileMotion(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MOTION_QUERY)
    const update = () => setIsMobile(media.matches)

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return isMobile
}
