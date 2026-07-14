"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import RollingText from "@/components/shared/rolling-text"
import { createPortal } from "react-dom"
import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import { useI18n } from "@/components/providers/i18n"
import FinalCtaContent from "@/components/shared/final-cta-content"
import ScrollProgress from "@/components/layout/scroll-progress"
import ArrowDownRight from "@/components/gallery/arrow-down-right"
import { getTranslatedGalleryProjects, getTranslatedPlaygroundPieces, type GalleryImage, type GalleryProject } from "@/data/gallery"

const playgroundOffset = ["", "mt-3", "mt-1", "mt-2", "", "mt-2", "mt-1"]

function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const target = document.querySelector(event.currentTarget.hash)
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
}

type ViewCursorHandlers = {
  onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

function useViewCursor() {
  const { t } = useI18n()
  const reducedMotion = Boolean(useReducedMotion())
  const [canHover, setCanHover] = useState(false)
  const [hovered, setHovered] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const cursorX = useSpring(pointerX, { stiffness: 105, damping: 22, mass: 0.72 })
  const cursorY = useSpring(pointerY, { stiffness: 105, damping: 22, mass: 0.72 })

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => {
      const enabled = hoverQuery.matches && !reducedMotion
      setCanHover(enabled)
      if (!enabled) setHovered(false)
    }

    update()
    hoverQuery.addEventListener("change", update)
    return () => hoverQuery.removeEventListener("change", update)
  }, [reducedMotion])

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canHover) return
    pointerX.set(event.clientX)
    pointerY.set(event.clientY)
  }

  const handlers: ViewCursorHandlers = {
    onPointerEnter: (event) => {
      if (!canHover) return
      move(event)
      setHovered(true)
    },
    onPointerMove: move,
    onPointerLeave: () => setHovered(false),
  }

  const cursor = canHover ? (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30001"
      style={{ x: cursorX, y: cursorY }}
      initial={false}
      animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.72 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1800ad] px-3 text-center font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_40px_rgba(24,0,173,0.28)]">
        {t("cursorView")}
      </span>
    </motion.div>
  ) : null

  return { handlers, cursor }
}

function countProjectPieces(project: GalleryProject) {
  return (
    project.pieces.length +
    (project.stories?.length ?? 0) +
    (project.carousels?.reduce((total, carousel) => total + carousel.slides.length, 0) ?? 0)
  )
}

function getProjectCover(project: GalleryProject) {
  return project.heroMockup ?? project.pieces[0] ?? project.carousels?.[0]?.slides[0]
}

function GalleryHero({ projectCount, pieceCount }: { projectCount: number; pieceCount: number }) {
  const { t } = useI18n()

  return (
    <section className="container-bleed relative isolate min-h-svh overflow-hidden pb-8 pt-12 sm:pt-13 lg:pb-12">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-[3.3vw] top-[21svh] -z-10 hidden w-[80vw] font-sans text-[15.2vw] font-black uppercase leading-none text-transparent lg:block"
        style={{ WebkitTextStroke: "2px rgba(24, 0, 173, 0.075)" }}
      >
        {t("galleryArchiveGhost")}
      </p>
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -left-[0.08em] top-[16svh] -z-10 font-sans text-[32vw] font-black uppercase leading-none text-transparent sm:text-[24vw] lg:hidden"
        style={{ WebkitTextStroke: "1px rgba(24, 0, 173, 0.08)" }}
      >
        {t("galleryArchiveGhost")}
      </p>

      <div className="grid grid-cols-[1fr_auto] items-start gap-6 pr-20 text-[10px] font-black uppercase tracking-[0.22em] text-[#1e1e1e]/50 sm:grid-cols-3 sm:pr-22">
        <span>{t("galleryHeroArchiveLabel")}</span>
        <span className="hidden justify-self-center text-[#1800ad] sm:block">{t("galleryHeroSocialArchive")}</span>
        <span className="justify-self-end">2025 - 2026</span>
      </div>

      <div className="relative min-h-[calc(100svh-108px)] lg:min-h-[calc(100svh-104px)]">
        <div className="absolute left-0 top-[40svh] sm:top-[41svh] lg:left-[3.3vw] lg:top-[43svh]">
          <h1 className="whitespace-nowrap text-[clamp(3.9rem,15.6vw,7.2rem)] font-black leading-[0.76] text-[#030303] sm:text-[clamp(6.8rem,10.2vw,11.2rem)] lg:text-[clamp(7.6rem,9.2vw,11.8rem)]">
            {t("galleryHeroTitle")}
          </h1>
        </div>

        <div className="absolute left-0 top-[74svh] sm:top-[75svh] lg:top-[72svh]">
          <a
            href="#selected-projects"
            onClick={scrollToSection}
            className="group inline-flex w-max items-center gap-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#1e1e1e]/78 transition hover:text-[#1800ad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad] sm:text-[11px]"
          >
            <span className="transition group-hover:translate-y-1">
              <ArrowDownRight />
            </span>
          </a>
        </div>

        <div className="absolute right-0 top-[74svh] w-full max-w-155 sm:top-[75svh] lg:top-[72svh]">
          <dl className="grid border-t border-[#1e1e1e]/18 pt-7 text-[10px] font-black uppercase tracking-[0.14em] text-[#1e1e1e]/50 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div className="grid gap-1 border-b border-[#1e1e1e]/10 py-3 sm:border-b-0 sm:py-0">
              <dt className="order-2">{t("galleryHeroProjectsLabel")}</dt>
              <dd className="order-1 text-base leading-none text-[#1e1e1e]">{String(projectCount).padStart(2, "0")}</dd>
            </div>
            <span aria-hidden="true" className="hidden size-1.5 rounded-full bg-[#1800ad] sm:block" />
            <div className="grid gap-1 border-b border-[#1e1e1e]/10 py-3 sm:border-b-0 sm:justify-self-center sm:py-0">
              <dt className="order-2">{t("galleryHeroPiecesLabel")}</dt>
              <dd className="order-1 text-base leading-none text-[#1e1e1e]">{String(pieceCount).padStart(2, "0")}</dd>
            </div>
            <span aria-hidden="true" className="hidden size-1.5 rounded-full bg-[#1800ad] sm:block" />
            <div className="grid gap-1 py-3 sm:justify-self-end sm:py-0">
              <dt className="order-2">{t("galleryHeroOrderLabel")}</dt>
              <dd className="order-1 text-base leading-none text-[#1e1e1e]">{t("galleryHeroOrderValue")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

function SelectedProjectsIntro({ projectCount }: { projectCount: number }) {
  const { t } = useI18n()

  return (
    <section id="selected-projects" className="container-bleed relative isolate overflow-hidden pb-[clamp(42px,6vw,76px)] pt-[clamp(56px,9vw,112px)]">
      <div className="relative mt-[clamp(58px,12vw,132px)] grid gap-9 border-b border-[#1e1e1e]/14 pb-[clamp(42px,7vw,82px)] lg:grid-cols-[minmax(0,0.58fr)_minmax(360px,0.42fr)] lg:items-end">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-[8vw] top-[-0.26em] -z-10 hidden font-sans text-[15vw] font-black leading-none text-transparent lg:block"
          style={{ WebkitTextStroke: "2px rgba(24, 0, 173, 0.07)" }}
        >
          {String(projectCount).padStart(2, "0")}
        </p>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1800ad]">{t("gallerySelectedEyebrow")}</p>
          <h1 className="mt-5 max-w-[9ch] text-[clamp(3.35rem,12vw,6.4rem)] font-black leading-[0.92] text-[#030303] sm:text-[clamp(5.2rem,8.2vw,7.5rem)] lg:text-[clamp(4.6rem,6.2vw,6.8rem)]">
            {t("gallerySelectedTitle")}
          </h1>
        </div>

        <div className="max-w-[44ch] lg:justify-self-end lg:pb-3">
          <p className="text-base font-semibold leading-relaxed text-[#1e1e1e]/58 sm:text-xl">
            {t("gallerySelectedDescription")}
          </p>
          <a
            href="#gallery-projects"
            onClick={scrollToSection}
            className="group mt-6 inline-flex w-max items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#1800ad] transition hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad] sm:text-[11px]"
          >
            <span className="transition group-hover:translate-y-1">
              <ArrowDownRight />
            </span>
            <RollingText>{t("gallerySelectedArchiveLink")}</RollingText>
          </a>
        </div>
      </div>
    </section>
  )
}

function SelectedProjectCard({ project, index, viewCursor }: { project: GalleryProject; index: number; viewCursor: ViewCursorHandlers }) {
  const { t } = useI18n()
  const cover = getProjectCover(project)
  const pieceCount = countProjectPieces(project)

  return (
    <article className="border-b border-[#1e1e1e]/12 pb-9 lg:border-b-0 lg:pb-0">
      <div className="mb-3 grid grid-cols-[1fr_auto] items-end gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1800ad]">{String(index + 1).padStart(2, "0")}</p>
          <h2 className="mt-2 text-[clamp(1.55rem,5vw,2rem)] font-black leading-none text-[#030303]">{project.name}</h2>
        </div>
        <span className="pb-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#1e1e1e]/46">{pieceCount} {t("galleryPieceCountLabel")}</span>
      </div>

      {cover ? (
        <Link
          href={`/gallery/${project.slug}`}
          data-cursor="hidden"
          onPointerEnter={viewCursor.onPointerEnter}
          onPointerMove={viewCursor.onPointerMove}
          onPointerLeave={viewCursor.onPointerLeave}
          className="group block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad]"
        >
          <span className="relative block aspect-[2.45/1] lg:aspect-square">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(max-width: 768px) 92vw, 30vw"
              className="object-contain transition duration-700 group-hover:scale-[1.02]"
              priority={index < 3}
            />
          </span>
        </Link>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-4 border-b border-[#1e1e1e]/12 pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#1e1e1e]/48 lg:border-b-0">
        <span>{project.type}</span>
        <span className="hidden lg:inline">{pieceCount} {t("galleryPieceCountLabel")}</span>
      </div>

      <p className="mt-5 hidden text-base leading-relaxed text-[#1e1e1e]/62 lg:block">{project.description}</p>
      <Link
        href={`/gallery/${project.slug}`}
        className="mt-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#1800ad] transition hover:gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad]"
      >
        <RollingText>{t("galleryViewMorePieces")}</RollingText> <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

function SelectedProjects({ projects }: { projects: GalleryProject[] }) {
  const viewCursor = useViewCursor()

  return (
    <>
      <section id="gallery-projects" className="container-bleed pb-[clamp(56px,9vw,112px)]">
        <div className="grid gap-9 lg:grid-cols-3 lg:gap-12">
          {projects.map((project, index) => (
            <SelectedProjectCard key={project.slug} project={project} index={index} viewCursor={viewCursor.handlers} />
          ))}
        </div>
      </section>
      {viewCursor.cursor}
    </>
  )
}

function PlaygroundPiece({
  piece,
  index,
  onOpen,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
}: {
  piece: GalleryImage
  index: number
  onOpen: () => void
  onPointerEnter: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerLeave: () => void
}) {
  const { t } = useI18n()

  return (
    <figure className={`min-w-0 transition-[opacity,transform] duration-500 ease-out group-hover/playground:opacity-55 hover:!opacity-100 hover:-translate-y-0.5 focus-within:!opacity-100 motion-reduce:transform-none motion-reduce:transition-none ${playgroundOffset[index % playgroundOffset.length]}`}>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="hidden"
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-label={`${t("galleryPlaygroundOpen")}: ${piece.title}`}
        className="relative block aspect-4/5 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1800ad]"
      >
        <Image
          src={piece.src}
          alt={piece.alt}
          fill
          sizes="(max-width: 379px) 94vw, (max-width: 639px) 47vw, (max-width: 1023px) 32vw, 24vw"
          className="object-contain transition-transform duration-500 ease-out hover:scale-[1.008] motion-reduce:transition-none"
        />
      </button>
      <figcaption className="sr-only">{piece.title}</figcaption>
    </figure>
  )
}

function PlaygroundSection({ pieces }: { pieces: GalleryImage[] }) {
  const { t } = useI18n()
  const viewCursor = useViewCursor()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activePiece = activeIndex === null ? null : pieces[activeIndex]
  const activePosition = activeIndex ?? 0

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % pieces.length)
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + pieces.length) % pieces.length)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, pieces.length])

  return (
    <>
      <section id="creative-playground" aria-labelledby="playground-title" className="container-bleed border-t border-[#1e1e1e]/12 pb-[clamp(56px,7vw,88px)] pt-[clamp(52px,7vw,84px)]">
        <header className="grid gap-7 border-b border-[#1e1e1e]/18 pb-[clamp(32px,5vw,56px)] lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:items-end">
          <h2 id="playground-title" className="text-[clamp(3.1rem,9vw,7.6rem)] font-black uppercase leading-[0.84] tracking-[-0.065em] text-[#1e1e1e]">
            {t("galleryPlaygroundTitle")}
          </h2>
          <div className="lg:justify-self-end">
            <p className="max-w-[44ch] text-base font-semibold leading-relaxed text-[#1e1e1e]/62 sm:text-lg">{t("galleryPlaygroundDescription")}</p>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-[#1800ad]">
              {String(pieces.length).padStart(2, "0")} {t("galleryPlaygroundCount")}
            </p>
          </div>
        </header>

        <div className="group/playground mt-4 grid grid-cols-1 items-start gap-x-1.5 gap-y-2 min-[380px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-2 lg:grid-cols-4">
          {pieces.map((piece, index) => (
            <PlaygroundPiece
              key={piece.src}
              piece={piece}
              index={index}
              onOpen={() => setActiveIndex(index)}
              onPointerEnter={viewCursor.handlers.onPointerEnter}
              onPointerMove={viewCursor.handlers.onPointerMove}
              onPointerLeave={viewCursor.handlers.onPointerLeave}
            />
          ))}
        </div>
      </section>

      {viewCursor.cursor}

      {activePiece && typeof document !== "undefined" ? createPortal(
        <div role="dialog" aria-modal="true" aria-label={activePiece.title} className="fixed inset-0 z-20000 grid place-items-center bg-[#1e1e1e]/96 p-3 text-[#e8e7e7] sm:p-6">
          <button type="button" onClick={() => setActiveIndex(null)} aria-label={t("galleryPlaygroundClose")} className="absolute inset-0 cursor-default" />
          <div className="pointer-events-none relative z-10 flex h-full max-h-[calc(100svh-1.5rem)] w-full max-w-7xl flex-col sm:max-h-[calc(100svh-3rem)]">
            <div className="pointer-events-auto flex items-center justify-between border-b border-[#e8e7e7]/18 pb-3 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-[#e8e7e7]/58">{String(activePosition + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}</span>
              <button ref={closeButtonRef} type="button" onClick={() => setActiveIndex(null)} className="transition hover:text-[#1800ad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7]">{t("galleryPlaygroundClose")}</button>
            </div>
            <figure className="relative min-h-0 flex-1">
              <Image src={activePiece.src} alt={activePiece.alt} fill sizes="100vw" className="object-contain py-4" priority />
              <figcaption className="sr-only">{activePiece.title}</figcaption>
            </figure>
            <div className="pointer-events-auto flex items-center justify-between border-t border-[#e8e7e7]/18 pt-3 text-[10px] font-black uppercase tracking-[0.18em]">
              <button type="button" onClick={() => setActiveIndex((activePosition - 1 + pieces.length) % pieces.length)} aria-label={t("galleryPlaygroundPrevious")} className="min-h-11 px-3 transition hover:text-[#1800ad] focus-visible:outline-2 focus-visible:outline-[#e8e7e7]">← {t("galleryPlaygroundPrevious")}</button>
              <button type="button" onClick={() => setActiveIndex((activePosition + 1) % pieces.length)} aria-label={t("galleryPlaygroundNext")} className="min-h-11 px-3 transition hover:text-[#1800ad] focus-visible:outline-2 focus-visible:outline-[#e8e7e7]">{t("galleryPlaygroundNext")} →</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  )
}

function FinalGalleryCta() {
  const { t } = useI18n()

  return (
    <FinalCtaContent
      id="gallery-final-cta"
      titleLines={[t("galleryFinalLine1"), t("galleryFinalLine2")]}
      button={t("galleryFinalButton")}
      theme="dark"
    />
  )
}

export default function DesignGallery() {
  const { t } = useI18n()
  const projects = useMemo(() => getTranslatedGalleryProjects(t), [t])
  const playground = useMemo(() => getTranslatedPlaygroundPieces(t), [t])
  const totalPieces = projects.reduce((total, project) => total + countProjectPieces(project), playground.length)

  useEffect(() => {
    document.title = t("galleryMetaTitle")
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("galleryMetaDescription"))
  }, [t])

  return (
    <div className="min-h-svh bg-[#e8e7e7] text-[#1e1e1e]">
      <ScrollProgress />
      <GalleryHero projectCount={projects.length} pieceCount={totalPieces} />
      <SelectedProjectsIntro projectCount={projects.length} />
      <SelectedProjects projects={projects} />
      <PlaygroundSection pieces={playground} />
      <FinalGalleryCta />
    </div>
  )
}
