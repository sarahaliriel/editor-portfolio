"use client"

import { useEffect } from "react"
import Gallery from "@/components/home/gallery"
import WhatMoves from "@/components/home/what-moves"
import Contact from "@/components/home/contact"

export default function GalleryContactTransition() {
  const scrollToContactOpen = (behavior: ScrollBehavior) => {
    const el = document.getElementById("contact")
    if (!el) return
    el.scrollIntoView({ behavior, block: "start" })
  }

  useEffect(() => {
    const onNav = () => scrollToContactOpen("smooth")
    window.addEventListener("nav:contact", onNav)

    const hash = typeof window !== "undefined" ? window.location.hash : ""
    if (hash === "#contact") scrollToContactOpen("auto")

    return () => window.removeEventListener("nav:contact", onNav)
  }, [])

  return (
    <>
      <Gallery />
      <WhatMoves />
      <Contact />
    </>
  )
}
