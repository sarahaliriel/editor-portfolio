"use client"

import { useEffect } from "react"
import Contact from "@/components/home/contact"

export default function HomeAfterWork() {
  useEffect(() => {
    const scrollToContact = (behavior: ScrollBehavior) => {
      document.getElementById("contact")?.scrollIntoView({ behavior, block: "start" })
    }

    const onNav = () => scrollToContact("smooth")
    window.addEventListener("nav:contact", onNav)

    if (window.location.hash === "#contact") scrollToContact("auto")

    return () => window.removeEventListener("nav:contact", onNav)
  }, [])

  return (
    <div hidden aria-hidden="true">
      <Contact id="legacy-contact" />
    </div>
  )
}
