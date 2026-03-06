"use client"

import Image from "next/image"
import { useMemo } from "react"
import { useI18n } from "@/components/i18n"

type Shot = {
  src: string
  alt: string
  w: number
  h: number
}

export default function Gallery() {
  const { t } = useI18n()

  const shots = useMemo<Shot[]>(
    () => [
      { src: "/images/g00.png", alt: "Post 1", w: 1080, h: 1080 },
      { src: "/images/g0.png", alt: "Post 2", w: 1080, h: 1080 },
      { src: "/images/g1.png", alt: "Post 3", w: 1080, h: 1080 },
      { src: "/images/g2.png", alt: "Post 4", w: 1080, h: 1080 },
      { src: "/images/g3.png", alt: "Post 5", w: 1080, h: 1080 },
      { src: "/images/g004.png", alt: "Post 6", w: 1080, h: 1080 },
      { src: "/images/g5.png", alt: "Post 7", w: 1080, h: 1080 },
      { src: "/images/g05.png", alt: "Post 8", w: 1080, h: 1080 },
      { src: "/images/g6.png", alt: "Post 9", w: 1080, h: 1080 },
      { src: "/images/g7.png", alt: "Post 10", w: 1080, h: 1080 },
      { src: "/images/g07.png", alt: "Post 11", w: 1080, h: 1080 },
      { src: "/images/g8.png", alt: "Post 12", w: 1080, h: 1080 },
      { src: "/images/g9.png", alt: "Post 13", w: 1080, h: 1080 },
      { src: "/images/g010.png", alt: "Post 14", w: 1080, h: 1080 },
      { src: "/images/g11.png", alt: "Post 15", w: 1080, h: 1080 },
      { src: "/images/g12.png", alt: "Post 16", w: 1080, h: 1080 },
      { src: "/images/g13.png", alt: "Post 17", w: 1080, h: 1080 },
      { src: "/images/g14.png", alt: "Post 18", w: 1080, h: 1080 },
      { src: "/images/g15.png", alt: "Post 19", w: 1080, h: 1080 },
      { src: "/images/g016.png", alt: "Post 20", w: 1080, h: 1080 },
      { src: "/images/g017.png", alt: "Post 21", w: 1080, h: 1080 },
      { src: "/images/g018.png", alt: "Post 22", w: 1080, h: 1080 },
    ],
    []
  )

  const row = useMemo(() => [...shots, ...shots], [shots])

  return (
    <section id="gallery" className="relative min-h-svh bg-[#e8e7e7] text-[#1e1e1e] overflow-hidden">
      <div className="container-bleed pt-[clamp(28px,6svh,56px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(18px,3.6vw,56px)] items-end">
          <div className="lg:col-span-6">
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-[44px] leading-[0.95] sm:text-[60px] lg:text-[86px]">
              {t("galleryTitle")}
            </h2>

            <p className="mt-5 max-w-[52ch] text-[14px] leading-[1.55] text-[rgba(30,30,30,.72)]">
              {t("galleryDesc")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-10 text-[12px] tracking-[0.18em] uppercase text-[rgba(30,30,30,.62)]">
              <span className="inline-flex items-center gap-8">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1800ad]" />
                {t("galleryTagFeed")}
              </span>
              <span className="inline-flex items-center gap-8">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1800ad]" />
                {t("galleryTagStory")}
              </span>
              <span className="inline-flex items-center gap-8">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1800ad]" />
                {t("galleryTagCarousel")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-bleed mt-[clamp(18px,4svh,36px)]">
        <div className="hairline" />
      </div>

      <div className="gallery-marquee mt-[clamp(18px,5svh,52px)] pb-[clamp(42px,10svh,120px)]">
        <div className="gallery-marquee-wrap">
          <div className="gallery-marquee-track gallery-marquee-left">
            {row.map((s, i) => (
              <figure key={`${s.src}-${i}`} className="gallery-shot">
                <Image src={s.src} alt={s.alt} width={s.w} height={s.h} className="gallery-shot-img" priority={i < 2} />
              </figure>
            ))}
          </div>
        </div>

        <div className="container-bleed mt-12">
          <div className="flex items-center justify-between gap-12">
            <p className="caption max-w-[68ch]">
              {t("galleryCaptionA")}
              <br />
              {t("galleryCaptionB")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}