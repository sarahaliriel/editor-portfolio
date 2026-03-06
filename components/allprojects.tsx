"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useI18n } from "@/components/i18n"

type CategoryKey = "lab" | "social" | "story"

type Project = {
  id: string
  category: CategoryKey
  tagsLine: string
  cover: string
  src: string
  poster: string
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function wrapIndex(i: number, len: number) {
  if (len <= 0) return 0
  const r = i % len
  return r < 0 ? r + len : r
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00"
  const s = Math.floor(sec)
  const m = Math.floor(s / 60)
  const rr = s % 60
  return `${m}:${String(rr).padStart(2, "0")}`
}

export default function AllProjects() {
  const { t } = useI18n()

  const categories = useMemo(
    () => ({
      lab: { title: t("allprojectsTitle1") },
      social: { title: t("allprojectsTitle2") },
      story: { title: t("allprojectsTitle4") },
    }),
    [t]
  )

const projects = useMemo<Project[]>(
    () => [
      {
        id: "01",
        category: "lab",
        tagsLine: "anime edit | jugg | alight motion",
        cover: "/images/p1.jpg",
        src: "/videos/creative-01.mp4",
        poster: "/images/p1.jpg",
      },
      {
        id: "02",
        category: "lab",
        tagsLine: "typography | mograph | alight motion",
        cover: "/images/p5.jpg",
        src: "/videos/creative-02.mp4",
        poster: "/images/p5.jpg",
      },
      {
        id: "03",
        category: "lab",
        tagsLine: "transition | glitch | alight motion",
        cover: "/images/p4.jpg",
        src: "/videos/creative-08.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "04",
        category: "social",
        tagsLine: "shorts | captions | cap cut",
        cover: "/images/p2.jpg",
        src: "/videos/social-03.mp4",
        poster: "/images/p2.jpg",
      },
      {
        id: "05",
        category: "social",
        tagsLine: "shorts | captions | davinci",
        cover: "/images/p4.jpg",
        src: "/videos/social-01.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "06",
        category: "lab",
        tagsLine: "typograph | transitions | alight motion",
        cover: "/images/p1.jpg",
        src: "/videos/creative-03.mp4",
        poster: "/images/p1.jpg",
      },
      {
        id: "07",
        category: "social",
        tagsLine: "shorts | captions | cap cut",
        cover: "/images/p2.jpg",
        src: "/videos/social-04.mp4",
        poster: "/images/p2.jpg",
      },
      {
        id: "08",
        category: "lab",
        tagsLine: "png style | aesthetic | alight motion",
        cover: "/images/p5.jpg",
        src: "/videos/creative-04.mp4",
        poster: "/images/p5.jpg",
      },
      {
        id: "09",
        category: "social",
        tagsLine: "shorts | captions | davinci",
        cover: "/images/p2.jpg",
        src: "/videos/social-06.mp4",
        poster: "/images/p2.jpg",
      },
      {
        id: "10",
        category: "lab",
        tagsLine: "transition | glitch | alight motion",
        cover: "/images/p5.jpg",
        src: "/videos/creative-05.mp4",
        poster: "/images/p5.jpg",
      },
      {
        id: "11",
        category: "social",
        tagsLine: "shorts | motion edit | alight motion",
        cover: "/images/p4.jpg",
        src: "/videos/social-02.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "12",
        category: "lab",
        tagsLine: "transition | aesthetic | alight motion",
        cover: "/images/p4.jpg",
        src: "/videos/creative-06.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "13",
        category: "lab",
        tagsLine: "transition | glitch | alight motion",
        cover: "/images/p4.jpg",
        src: "/videos/creative-07.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "14",
        category: "lab",
        tagsLine: "typograph | glitch | alight motion",
        cover: "/images/p4.jpg",
        src: "/videos/creative-10.mp4",
        poster: "/images/p4.jpg",
      },
      {
        id: "15",
        category: "story",
        tagsLine: "stop motion | narrative | alight motion",
        cover: "/images/p3.jpg",
        src: "/videos/story-01.mp4",
        poster: "/images/p3.jpg",
      },
    ],
    []
  )
  const total = projects.length
  const [active, setActive] = useState(0)
  const idx = wrapIndex(active, total)
  const current = projects[idx]
  const catTitle = categories[current.category]?.title ?? ""

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<HTMLDivElement | null>(null)

  const wheelAccum = useRef(0)
  const wheelLock = useRef(false)

  const [playing, setPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [volume, setVolume] = useState(0.65)
  const [muted, setMuted] = useState(false)
  const lastVolume = useRef(0.65)

  const [volPanel, setVolPanel] = useState(false)
  const volCloseTimer = useRef<number | null>(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const seekValRef = useRef(0)

  const [showControls, setShowControls] = useState(true)
  const controlsTimer = useRef<number | null>(null)

  const [hoveringBar, setHoveringBar] = useState(false)
  const [hoverPct, setHoverPct] = useState(0)
  const [hoverTime, setHoverTime] = useState(0)

  const p = useMemo(() => {
    if (total <= 1) return 0
    return Math.min(1, Math.max(0, idx / (total - 1)))
  }, [idx, total])

  const pct = useMemo(() => Math.round(p * 100), [p])

  const goTo = (next: number) => {
    setActive(wrapIndex(next, total))
  }

  const next = () => setActive((v) => wrapIndex(v + 1, total))
  const prev = () => setActive((v) => wrapIndex(v - 1, total))

  useEffect(() => {
    const prevOverflowX = document.documentElement.style.overflowX
    const prevOverflowY = document.documentElement.style.overflowY
    document.documentElement.style.overflowX = "hidden"
    document.documentElement.style.overflowY = "hidden"
    return () => {
      document.documentElement.style.overflowX = prevOverflowX
      document.documentElement.style.overflowY = prevOverflowY
    }
  }, [])

  useEffect(() => {
    const host = wrapRef.current
    if (!host) return

    const onWheel = (e: WheelEvent) => {
      if (!host.contains(e.target as Node)) return
      e.preventDefault()

      if (wheelLock.current) return
      wheelAccum.current += e.deltaY

      const threshold = 44
      if (Math.abs(wheelAccum.current) < threshold) return

      const dir = wheelAccum.current > 0 ? 1 : -1
      wheelAccum.current = 0
      wheelLock.current = true

      if (dir > 0) next()
      else prev()

      window.setTimeout(() => {
        wheelLock.current = false
      }, 220)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel as any)
  }, [total])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.controls = false
    v.loop = true
    v.playsInline = true
  }, [])

  useEffect(() => {
    const onFs = () => {
      const d = document as any
      const el = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement
      setIsFullscreen(Boolean(el))
    }
    document.addEventListener("fullscreenchange", onFs)
    document.addEventListener("webkitfullscreenchange", onFs as any)
    document.addEventListener("mozfullscreenchange", onFs as any)
    document.addEventListener("MSFullscreenChange", onFs as any)
    return () => {
      document.removeEventListener("fullscreenchange", onFs)
      document.removeEventListener("webkitfullscreenchange", onFs as any)
      document.removeEventListener("mozfullscreenchange", onFs as any)
      document.removeEventListener("MSFullscreenChange", onFs as any)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted || volume <= 0
    v.volume = Math.max(0, Math.min(1, volume))
  }, [muted, volume, idx])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onLoaded = () => {
      const d = Number.isFinite(v.duration) ? v.duration : 0
      setDuration(d)
      setCurrentTime(0)
    }

    const onTime = () => {
      if (seeking) return
      setCurrentTime(v.currentTime || 0)
    }

    v.addEventListener("loadedmetadata", onLoaded)
    v.addEventListener("durationchange", onLoaded)
    v.addEventListener("timeupdate", onTime)

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded)
      v.removeEventListener("durationchange", onLoaded)
      v.removeEventListener("timeupdate", onTime)
    }
  }, [seeking, idx])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    setCurrentTime(0)
    setPlaying(true)
    setShowControls(true)
    v.play().catch(() => {})
  }, [idx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTyping = Boolean(
        target?.isContentEditable ||
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          (target && (target as any).role === "textbox")
      )
      if (isTyping) return
      e.preventDefault()
      togglePlay()
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    showNow()
    if (v.paused) {
      v.play().catch(() => {})
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const requestFs = async () => {
    const el = playerRef.current as any
    if (!el) return
    try {
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
      else if (el.mozRequestFullScreen) await el.mozRequestFullScreen()
      else if (el.msRequestFullscreen) await el.msRequestFullscreen()
    } catch {}
  }

  const exitFs = async () => {
    const d = document as any
    try {
      if (d.exitFullscreen) await d.exitFullscreen()
      else if (d.webkitExitFullscreen) await d.webkitExitFullscreen()
      else if (d.mozCancelFullScreen) await d.mozCancelFullScreen()
      else if (d.msExitFullscreen) await d.msExitFullscreen()
    } catch {}
  }

  const toggleFs = () => {
    showNow()
    if (isFullscreen) exitFs()
    else requestFs()
  }

  const toggleMute = () => {
    showNow()
    if (muted || volume <= 0) {
      setMuted(false)
      setVolume(lastVolume.current > 0 ? lastVolume.current : 0.65)
      return
    }
    lastVolume.current = volume
    setMuted(true)
  }

  const setVol = (val: number) => {
    showNow()
    const nextV = Math.max(0, Math.min(1, val))
    setVolume(nextV)
    if (nextV <= 0) setMuted(true)
    else setMuted(false)
  }

  const beginSeek = () => {
    showNow()
    setSeeking(true)
  }

  const moveSeek = (val01: number) => {
    showNow()
    const v = videoRef.current
    if (!v) return
    const d = Number.isFinite(v.duration) ? v.duration : duration
    const nextT = Math.max(0, Math.min(d || 0, (d || 0) * val01))
    seekValRef.current = nextT
    setCurrentTime(nextT)
  }

  const commitSeek = () => {
    showNow()
    const v = videoRef.current
    if (!v) {
      setSeeking(false)
      return
    }
    const nextT = seekValRef.current
    v.currentTime = nextT
    setCurrentTime(nextT)
    setSeeking(false)
  }

  const progress01 = useMemo(() => {
    const d = duration || 0
    if (!d) return 0
    return Math.max(0, Math.min(1, currentTime / d))
  }, [currentTime, duration])

  const showNow = () => {
    setShowControls(true)
    if (controlsTimer.current) window.clearTimeout(controlsTimer.current)
    controlsTimer.current = window.setTimeout(() => {
      setShowControls(false)
    }, 1700)
  }

  useEffect(() => {
    if (!playing) {
      setShowControls(true)
      if (controlsTimer.current) window.clearTimeout(controlsTimer.current)
      return
    }
    showNow()
  }, [playing])

  const openVol = () => {
    if (volCloseTimer.current) window.clearTimeout(volCloseTimer.current)
    setVolPanel(true)
  }

  const closeVolSoon = () => {
    if (volCloseTimer.current) window.clearTimeout(volCloseTimer.current)
    volCloseTimer.current = window.setTimeout(() => setVolPanel(false), 220)
  }

  const thumbWindow = useMemo(() => {
    const a = wrapIndex(idx - 1, total)
    const b = idx
    const c = wrapIndex(idx + 1, total)
    return [a, b, c]
  }, [idx, total])

  const CoverThumb = (prj: Project, on: boolean) => {
    const sizeClass = on ? "h-[74px] w-[min(260px,100%)]" : "h-[74px] w-[min(220px,100%)]"
    const leftSlice = on ? "w-[78px]" : "w-[58px]"

    return (
      <div className={["relative overflow-hidden bg-[#1e1e1e]/10", sizeClass].join(" ")}>
        <div className={["absolute left-0 top-0 bottom-0", leftSlice].join(" ")}>
          <div className="absolute inset-0 bg-[#1e1e1e]/12" />
        </div>

        <Image src={prj.cover} alt="" fill className="object-cover" sizes="300px" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent opacity-60" />
      </div>
    )
  }

  const playerWidth = "w-[min(980px,100%)]"

  const onProgressMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const pct = rect.width ? x / rect.width : 0
    setHoverPct(pct)
    setHoverTime((duration || 0) * pct)
  }

  return (
    <div ref={wrapRef} className="h-svh w-screen overflow-hidden bg-[#e8e7e7] text-[#1e1e1e]">
      <div className="mx-auto h-full w-full max-w-390 px-6 sm:px-8 lg:px-12 pt-10 pb-10">
        <div className="grid h-full grid-rows-[auto_auto_1fr] gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-10">
            <div className="text-[34px] sm:text-[40px] lg:text-[44px] font-semibold tracking-[-0.03em] leading-[1.05] sm:whitespace-nowrap">
              Todos os Projetos
            </div>
            <div className="hidden lg:block" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-10 items-end">
            <div className="pt-8 text-[14px] tracking-[0.28em] opacity-55">
              {pad2(idx + 1)}/{pad2(total)}
            </div>

            <div className={["mx-auto lg:mx-auto min-w-0", playerWidth].join(" ")}>
              <div className="text-right">
                <div className="text-[26px] sm:text-[30px] font-semibold tracking-[0.48em] truncate">{catTitle}</div>
                <div className="mt-2 text-[13px] sm:text-[14px] tracking-[0.28em] opacity-55 truncate">
                  {current.tagsLine.split("|").map((x, i, arr) => (
                    <span key={`${x}-${i}`} className="transition-colors duration-200 hover:text-[#1800ad]">
                      {x.trim()}
                      {i < arr.length - 1 ? <span className="opacity-55"> | </span> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-10 min-h-0">
            <div className="flex flex-col gap-10">
              {thumbWindow.map((i) => {
                const prj = projects[i]
                const on = i === idx
                return (
                  <button
                    key={`thumb-${prj.id}-${i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    className={["relative transition-opacity duration-250", on ? "opacity-100" : "opacity-85 hover:opacity-100"].join(" ")}
                    aria-label={`Selecionar ${prj.id}`}
                  >
                    {CoverThumb(prj, on)}
                  </button>
                )
              })}
            </div>

            <div className="relative flex min-h-0">
              <div className="relative mt-auto w-full">
                <div
                  ref={playerRef}
                  className={["relative mx-auto bg-black", isFullscreen ? "w-full" : playerWidth].join(" ")}
                  style={{ height: isFullscreen ? "100%" : "clamp(420px,54vh,540px)" }}
                  onMouseMove={showNow}
                  onTouchStart={showNow}
                >
                  <button type="button" onClick={togglePlay} className="absolute inset-0 z-10" aria-label="Reproduzir pausar" />

                  <video
                    ref={videoRef}
                    key={`inline-${current.src}`}
                    src={current.src}
                    poster={current.poster}
                    playsInline
                    autoPlay
                    loop
                    muted={muted || volume <= 0}
                    controls={false}
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-contain"
                  />

                  <div className="absolute right-4 top-4 z-30">
                    <button
                      type="button"
                      onClick={() => (isFullscreen ? exitFs() : toggleFs())}
                      className={[
                        "px-4 py-2 text-[12px] font-medium tracking-[0.18em] uppercase text-[#1800ad] backdrop-blur-sm",
                        isFullscreen ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
                      ].join(" ")}
                      aria-label={isFullscreen ? "Fechar" : "Expandir"}
                    >
                      {isFullscreen ? "close" : "expand"}
                    </button>
                  </div>

                  <div
                    className={[
                      "absolute inset-x-0 bottom-0 z-20 transition-opacity duration-250",
                      showControls || !playing ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                    ].join(" ")}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/72 via-black/22 to-transparent" />
<div className="relative px-6 pb-5">
  <div className="flex items-center gap-3" onMouseEnter={() => setHoveringBar(true)} onMouseLeave={() => setHoveringBar(false)}>
    <button
      type="button"
      onClick={togglePlay}
      className="grid h-10 w-12 place-items-center text-[#1800ad] backdrop-blur-sm opacity-95 hover:opacity-100"
      aria-label="Play pause"
    >
      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 7.2V16.8c0 .9 1 1.4 1.8.9l7.2-4.8c.7-.5.7-1.4 0-1.9l-7.2-4.8C10 5.8 9 6.3 9 7.2Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>

    <div className="min-w-11 text-[12px] font-medium tracking-[0.14em] text-[#1800ad]/85 tabular-nums">
      {formatTime(currentTime)}
    </div>

    <div className="relative flex-1" onMouseMove={onProgressMove}>
      <div
        className={[
          "absolute -top-9 z-30 transition-opacity duration-150",
          hoveringBar ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ left: `${hoverPct * 100}%`, transform: "translateX(-50%)" }}
      >
        <div className="px-3 py-1 text-[11px] tracking-[0.16em] text-[#1800ad] backdrop-blur-md">
          {formatTime(hoverTime)}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round((seeking ? (duration ? currentTime / duration : 0) : progress01) * 1000)}
        onMouseDown={beginSeek}
        onTouchStart={beginSeek}
        onChange={(e) => moveSeek(Number(e.target.value) / 1000)}
        onMouseUp={commitSeek}
        onTouchEnd={commitSeek}
        className="ap-progress"
        style={{
          ["--ap-fill" as any]: `${(seeking ? (duration ? currentTime / duration : 0) : progress01) * 100}%`,
        }}
        aria-label="Progresso do vídeo"
      />
    </div>

    <div className="min-w-11 text-right text-[12px] font-medium tracking-[0.14em] text-[#1800ad]/65 tabular-nums">
      {formatTime(duration)}
    </div>

    <div className="flex items-center gap-2">
      <div
        className="relative"
        onMouseEnter={openVol}
        onMouseLeave={closeVolSoon}
        onFocus={openVol}
        onBlur={closeVolSoon}
      >
        <button
          type="button"
          onClick={() => {
            toggleMute()
            openVol()
          }}
          className="grid h-10 w-10 place-items-center text-[#1800ad] backdrop-blur-sm opacity-95 hover:opacity-100"
          aria-label={muted ? t("allprojectsSoundOn") : t("allprojectsSoundOff")}
        >
          {muted || volume <= 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 6.6 7.9 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2.9l3.1 2.4c1 .8 2.5.1 2.5-1.1V7.7c0-1.2-1.5-1.9-2.5-1.1Z"
                fill="currentColor"
              />
              <path d="M16.5 9.5 21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 9.5 16.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 6.6 7.9 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2.9l3.1 2.4c1 .8 2.5.1 2.5-1.1V7.7c0-1.2-1.5-1.9-2.5-1.1Z"
                fill="currentColor"
              />
              <path d="M17 9.2a4.5 4.5 0 0 1 0 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M19.8 7a8.5 8.5 0 0 1 0 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          )}
        </button>

        <div
          className={[
            "absolute left-1/2 bottom-full mb-3 h-32 w-10 -translate-x-1/2 px-3 py-3 backdrop-blur-md transition-all duration-200",
            volPanel ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none",
          ].join(" ")}
          onMouseEnter={openVol}
          onMouseLeave={closeVolSoon}
        >
          <div className="grid h-full w-full place-items-center">
            <input
              className="ap-vol ap-vol-vert"
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVol(Number(e.target.value) / 100)}
              style={{ ["--ap-fill" as any]: `${volume * 100}%` }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleFs}
        className="grid h-10 w-10 place-items-center text-[#1800ad] backdrop-blur-sm opacity-95 hover:opacity-100"
        aria-label={isFullscreen ? "Sair de ecrã inteiro" : "Ecrã inteiro"}
      >
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 9H5V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 9h4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 15H5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 15h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 5h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 19H5v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 19h4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  </div>
</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-1/2 z-60 hidden -translate-y-1/2 sm:block">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <div className="text-[11px] text-[#1800ad] font-semibold tracking-[0.16em] uppercase opacity-70">Scroll</div>
            <div className="text-[12px] text-[#1800ad] font-medium opacity-70 tabular-nums">{pct}%</div>
          </div>

          <div className="relative h-40 w-0.5 overflow-hidden rounded-full bg-[#1e1e1e]/20">
            <div className="absolute bottom-0 left-0 w-full rounded-full bg-[#1800ad]" style={{ height: `${p * 100}%` }} />
          </div>
        </div>
      </div>
<style jsx global>{`
  .ap-vol {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(#e8e7e7, #e8e7e7) 0/var(--ap-fill, 0%) 100% no-repeat, rgba(232, 231, 231, 0.25);
    outline: none;
  }
  .ap-vol-vert {
    width: 124px;
    transform: rotate(-90deg);
  }
  .ap-vol::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #e8e7e7;
  }
  .ap-vol::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #e8e7e7;
    border: 0;
  }
  .ap-vol::-moz-range-track {
    height: 3px;
    border-radius: 999px;
    background: rgba(232, 231, 231, 0.25);
  }
  .ap-vol::-moz-range-progress {
    height: 3px;
    border-radius: 999px;
    background: #e8e7e7;
  }

  .ap-progress {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(#e8e7e7, #e8e7e7) 0/var(--ap-fill, 0%) 100% no-repeat, rgba(232, 231, 231, 0.22);
    outline: none;
  }
  .ap-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0px;
    height: 0px;
    opacity: 0;
  }
  .ap-progress::-moz-range-thumb {
    width: 0px;
    height: 0px;
    opacity: 0;
    border: 0;
  }
  .ap-progress::-moz-range-track {
    height: 4px;
    border-radius: 999px;
    background: rgba(232, 231, 231, 0.22);
  }
  .ap-progress::-moz-range-progress {
    height: 4px;
    border-radius: 999px;
    background: #e8e7e7;
  }
`}</style>
    </div>
  )
}