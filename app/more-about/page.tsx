import type { Metadata } from "next"
import MoreAboutPage from "@/components/more-about/more-about"

const resetScrollScript = `
(() => {
  try {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  } catch {}
})();
`

const resetScrollStyle = "html{scroll-behavior:auto!important}"

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
  return (
    <>
      <style>{resetScrollStyle}</style>
      <script dangerouslySetInnerHTML={{ __html: resetScrollScript }} />
      <MoreAboutPage />
    </>
  )
}
