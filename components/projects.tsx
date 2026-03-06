"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/components/i18n"
import Link from "next/link"

type ProjectVideo =
  | { kind: "mp4"; src: string }
  | { kind: "embed"; src: string }

type Project = {
  client: string
  location: string
  services: string
  year: string
  thumb: string
  video?: ProjectVideo
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconMinimize() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 14h10" stroke="currentColor" strokeWidth="2" />
      <path d="M7 10h10" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

function IconExpand() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3H3v5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 3l7 7" stroke="currentColor" strokeWidth="2" />
      <path d="M16 21h5v-5" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-7-7" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconVolumeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5L6.5 9H3v6h3.5L11 19V5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9a3 3 0 0 1 0 6" stroke="currentColor" strokeWidth="2" />
      <path d="M17.5 6.5a6.5 6.5 0 0 1 0 11" stroke="currentColor" strokeWidth="2" opacity="0.75" />
    </svg>
  )
}

function IconVolumeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5L6.5 9H3v6h3.5L11 19V5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 9l5 6" stroke="currentColor" strokeWidth="2" />
      <path d="M21 9l-5 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function Projects() {
  const { t } = useI18n()

  const projects = useMemo<Project[]>(
    () => [
      {
        client: t("p1Client"),
        location: t("p1Location"),
        services: t("p1Services"),
        year: "2024",
        thumb: "/images/p1.jpg",
        video: { kind: "mp4", src: "/videos/p1.mp4" },
      },
      {
        client: t("p2Client"),
        location: t("p2Location"),
        services: t("p2Services"),
        year: "2024",
        thumb: "/images/p2.jpg",
        video: { kind: "mp4", src: "/videos/p2.mp4" },
      },
      {
        client: t("p3Client"),
        location: t("p3Location"),
        services: t("p3Services"),
        year: "2023",
        thumb: "/images/p3.jpg",
        video: { kind: "mp4", src: "/videos/p3.mp4" },
      },
      {
        client: t("p4Client"),
        location: t("p4Location"),
        services: t("p4Services"),
        year: "2023",
        thumb: "/images/p4.jpg",
        video: { kind: "mp4", src: "/videos/p4.mp4" },
      },
    ],
    [t]
  )

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const active = activeIndex != null ? projects[activeIndex] : null
  const canControlVolume = active?.video?.kind === "mp4"
  const overlayOpen = open && !minimized

  const close = () => {
    setOpen(false)
    setMinimized(false)
    setActiveIndex(null)
    setMuted(true)
  }

  const openProject = (i: number) => {
    setActiveIndex(i)
    setOpen(true)
    setMinimized(false)
    setMuted(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (minimized) close()
        else setMinimized(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, minimized])

  useEffect(() => {
    if (!overlayOpen) return
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [overlayOpen])

  useEffect(() => {
    if (!open) return
    if (!canControlVolume) return
    const v = videoRef.current
    if (!v) return
    v.muted = muted
  }, [muted, open, canControlVolume])

  useEffect(() => {
    if (!open) return
    if (!canControlVolume) return
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [open, canControlVolume])

  useEffect(() => {
    if (!open) return
    if (!canControlVolume) return
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.muted = true
    v.play().catch(() => {})
  }, [activeIndex, open, canControlVolume])

  return (
    <section id="work" className="relative pb-24 pt-16 sm:pb-32 sm:pt-20">
      <div className="container-bleed">
        <div className="mb-10 sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-3">
            <span className="h-0.5 w-10 bg-detail" />
          </div>

          <div className="flex items-end justify-between gap-8">
            <h2 className="font-display text-[46px] leading-[0.95] tracking-tighter2 sm:text-[64px] lg:text-[76px]">
              {t("projectsTitle")}
            </h2>
          </div>

          <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.7] opacity-70 sm:text-[16px]">{t("projectsDesc")}</p>
        </div>

        <div className="h-px w-full bg-ink/10" />

        <div className="mt-6">
          {projects.map((p, i) => (
            <button
              key={`${p.client}-${p.year}-${i}`}
              type="button"
              onClick={() => openProject(i)}
              className="group block w-full border-b border-ink/10 px-4 py-6 text-left transition-colors hover:bg-detail/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-detail/45 focus-visible:ring-offset-2 focus-visible:ring-offset-base sm:px-2 sm:py-8"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <div className="truncate font-display text-[30px] leading-[1.02] tracking-tighter2 sm:text-[44px]">
                    {p.client}
                  </div>
                  <div className="mt-2 text-[13px] opacity-70 sm:text-[14px]">
                    <span className="opacity-70">{p.services}</span>
                    <span className="mx-2 opacity-40">•</span>
                    <span className="opacity-70">{p.location}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[16px] font-semibold opacity-80">{p.year}</div>
                  <div className="mt-2 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.22em] opacity-70">
                    <span className="h-px w-10 bg-ink/20 transition group-hover:bg-detail/60" />
                    <span>{t("projectsOpen")}</span>
                  </div>
                </div>
              </div>
            </button>
            
          ))}
          <div className="mt-12 sm:mt-14">
  <Link href="/allprojects" className="group inline-flex items-center gap-6 text-[17px] font-medium">
    <span className="relative inline-flex items-center">
      <span className="relative">
        {t("projectsAllCta")}
        <span className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#1800ad] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"></span>
        <span className="ping-dot"></span>
      </span>
    </span>
    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-all duration-350 ease-[cubic-bezier(.16,1,.3,1)] group-hover:border-[#1800ad] group-hover:bg-[#1800ad]/10 group-hover:scale-110">
      <span className="transition-transform duration-350 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0.5">→</span>
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-350 group-hover:opacity-100 ring-1 ring-[#1800ad]/35"></span>
    </span>
  </Link>
      </div>
        </div>
      </div>

      {overlayOpen && active?.video ? (
        <div className="fixed inset-0 z-120 bg-[#0b0b0b]">
          <div className="absolute inset-0">
            {active.video.kind === "mp4" ? (
              <video
                ref={videoRef}
                src={active.video.src}
                className="h-full w-full object-contain"
                playsInline
                autoPlay
                loop
                muted={muted}
              />
            ) : (
              <iframe
                src={active.video.src}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={active.client}
              />
            )}
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e8e7e7]/15 bg-black/45 text-[#e8e7e7] backdrop-blur-md transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1800ad]/50"
              aria-label="Diminuir"
            >
              <IconMinimize />
            </button>

            <button
              type="button"
              onClick={() => {
                if (!canControlVolume) return
                setMuted((m) => !m)
              }}
              disabled={!canControlVolume}
              className={[
                "grid h-11 w-11 place-items-center rounded-full border bg-black/45 text-[#e8e7e7] backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1800ad]/50",
                canControlVolume ? "border-[#e8e7e7]/15 hover:bg-black/65" : "border-[#e8e7e7]/8 opacity-50",
              ].join(" ")}
              aria-label={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? <IconVolumeOff /> : <IconVolumeOn />}
            </button>

            <button
              type="button"
              onClick={close}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e8e7e7]/15 bg-black/45 text-[#e8e7e7] backdrop-blur-md transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1800ad]/50"
              aria-label="Fechar"
            >
              <IconX />
            </button>
          </div>
        </div>
      ) : null}

      {open && minimized && active?.video ? (
        <div className="fixed bottom-4 right-4 z-130 w-[min(92vw,460px)] overflow-hidden border border-ink/12 bg-base/70 backdrop-blur-md shadow-soft">
          <div className="relative aspect-video bg-ink/5">
            {active.video.kind === "mp4" ? (
              <video
                ref={videoRef}
                src={active.video.src}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                autoPlay
                loop
                muted={muted}
              />
            ) : (
              <Image src={active.thumb} alt={active.client} fill className="object-cover" sizes="460px" />
            )}

            <div className="absolute right-2 top-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMinimized(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 bg-base/75 text-ink backdrop-blur-md transition hover:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-detail/45"
                aria-label="Expandir"
              >
                <IconExpand />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!canControlVolume) return
                  setMuted((m) => !m)
                }}
                disabled={!canControlVolume}
                className={[
                  "grid h-10 w-10 place-items-center rounded-full border bg-base/75 text-ink backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-detail/45",
                  canControlVolume ? "border-ink/12 hover:bg-base" : "border-ink/8 opacity-50",
                ].join(" ")}
                aria-label={muted ? "Ativar som" : "Silenciar"}
              >
                {muted ? <IconVolumeOff /> : <IconVolumeOn />}
              </button>

              <button
                type="button"
                onClick={close}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 bg-base/75 text-ink backdrop-blur-md transition hover:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-detail/45"
                aria-label="Fechar"
              >
                <IconX />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold tracking-[0.02em] text-ink">{active.client}</div>
              <div className="mt-1 truncate text-[12px] opacity-70">{active.services}</div>
            </div>

            <div className="shrink-0 text-[12px] font-semibold tracking-[0.18em] opacity-60">{active.year}</div>
          </div>
        </div>
      ) : null}
    </section>
  )
}