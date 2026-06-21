import type { Metadata } from "next"
import MoreAboutPage from "@/components/more-about/more-about"

export const metadata: Metadata = {
  title: "More About Sarah Aliriel Dumitrache",
  description: "Creative evolution, services and tools by Sarah Aliriel Dumitrache.",
  openGraph: {
    title: "More About Sarah Aliriel Dumitrache",
    description: "Creative evolution across video editing, design and frontend development.",
    images: ["/images/moreabout/aboutme-photo.png"],
  },
}

export default function Page() {
  return <MoreAboutPage />
}
