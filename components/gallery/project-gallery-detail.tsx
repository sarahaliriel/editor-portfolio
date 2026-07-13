"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { useI18n } from "@/components/providers/i18n"
import ScrollProgress from "@/components/layout/scroll-progress"
import ArrowDownRight from "@/components/gallery/arrow-down-right"
import RollingText from "@/components/shared/rolling-text"
import { VisualSystem } from "@/components/gallery/visual-system"
import { getNextGalleryProject, getTranslatedGalleryProject, type GalleryCarousel, type GalleryImage, type GalleryProject, type GalleryProjectConfig } from "@/data/gallery"

type ViewerState = {
  carousel: GalleryCarousel
  index: number
}

type EditorialAsset = {
  image: GalleryImage
  label: string
  kind: "mockup" | "post" | "story" | "carousel"
  priority?: boolean
  carousel?: GalleryCarousel
}

type ProjectRhythm = {
  galleryOffset: number
  mockupOffset: number
  storyAlign: ["left" | "right", "left" | "right", "left" | "right"]
}

const EASE = [0.16, 1, 0.3, 1] as const

const galleryGroupVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
}

const galleryItemVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
}

const galleryLayout = [
  "col-span-1 sm:col-span-2 lg:col-span-3 lg:col-start-2",
  "col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-7 lg:mt-18",
  "col-span-1 sm:col-span-2 lg:col-span-3 lg:col-start-10 lg:mt-4",
  "col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-4 lg:-mt-6",
  "col-span-2 sm:col-span-2 lg:col-span-4 lg:col-start-7 lg:mt-20",
  "col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-2 lg:mt-10",
  "col-span-1 sm:col-span-2 lg:col-span-3 lg:col-start-5 lg:mt-2",
  "col-span-2 sm:col-span-2 lg:col-span-2 lg:col-start-10 lg:mt-24",
]

const mockupLayout = [
  "col-span-2 sm:col-span-3 lg:col-span-5 lg:col-start-1 lg:mt-10",
  "col-span-2 sm:col-span-3 lg:col-span-5 lg:col-start-8 lg:mt-16",
  "col-span-2 sm:col-span-3 lg:col-span-4 lg:col-start-4 lg:mt-4",
]

const projectRhythm: Record<string, ProjectRhythm> = {
  "frigideira-ai": { galleryOffset: 0, mockupOffset: 0, storyAlign: ["left", "right", "left"] },
  "the-real-tocha": { galleryOffset: 2, mockupOffset: 1, storyAlign: ["right", "left", "right"] },
  sdp: { galleryOffset: 4, mockupOffset: 2, storyAlign: ["left", "left", "right"] },
}

function getRhythm(slug: string): ProjectRhythm {
  return projectRhythm[slug] ?? { galleryOffset: 0, mockupOffset: 0, storyAlign: ["left", "right", "left"] }
}

function buildEditorialAssets(project: GalleryProject, labels: { mockup: string; post: string; story: string; slides: string }): EditorialAsset[] {
  const mockups =
    project.mockups?.map((image, index) => ({
      image,
      label: labels.mockup,
      kind: "mockup" as const,
      priority: index === 0,
    })) ?? []

  const posts = project.pieces.map((image) => ({
    image,
    label: labels.post,
    kind: "post" as const,
  }))

  const stories =
    project.stories?.map((image) => ({
      image,
      label: labels.story,
      kind: "story" as const,
    })) ?? []

  const carousels =
    project.carousels?.map((carousel) => ({
      image: carousel.slides[0],
      label: `${carousel.slides.length} ${labels.slides}`,
      kind: "carousel" as const,
      carousel,
    })) ?? []

  return [...mockups, ...posts, ...carousels, ...stories]
}

function HeroSection({ project, backLabel }: { project: GalleryProject; backLabel: string }) {
  const prefersReducedMotion = useReducedMotion()
  const projectTitle = project.heroTitle ?? project.name
  const isFrigideira = project.slug === "frigideira-ai"
  const scrollToStory = () => document.querySelector("#project-story")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })

  return (
    <section className="relative z-10 isolate min-h-svh max-w-full bg-[#e8e7e7] px-5 pb-20 pt-[clamp(76px,9vh,112px)] text-[#1e1e1e] sm:px-8 lg:flex lg:min-h-[clamp(760px,100svh,1080px)] lg:items-stretch lg:px-[clamp(40px,4.6vw,88px)] lg:pb-[clamp(72px,9vh,108px)]">
      <div className="relative z-20 flex min-w-0 w-full flex-col lg:w-[61%] lg:pr-[clamp(16px,1.5vw,30px)]">
        <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: -14 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
          <Link href="/gallery" className="w-max text-[11px] font-black uppercase tracking-[0.24em] text-[var(--project-accent-dark)] transition hover:text-[var(--project-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)]">
            <RollingText>{backLabel}</RollingText>
          </Link>
        </motion.div>

        <div className="mt-[clamp(72px,12vh,132px)] lg:mt-[clamp(112px,17vh,184px)] lg:flex lg:flex-1 lg:flex-col">
          <div>
            <motion.h1 initial={prefersReducedMotion ? false : { opacity: 0, y: 36, filter: "blur(10px)" }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, ease: EASE, delay: 0.08 }} className={`whitespace-nowrap font-display font-black uppercase leading-[0.76] tracking-[-0.075em] text-[#030303] ${isFrigideira ? "text-[clamp(3.65rem,12vw,13.5rem)]" : "text-[clamp(3rem,7.5vw,8.8rem)]"}`}>
              {projectTitle}
            </motion.h1>

            <motion.p initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} className="mt-[clamp(30px,4.5vh,52px)] max-w-[46ch] text-[clamp(0.95rem,1.2vw,1.25rem)] leading-[1.45] text-[#1e1e1e]/82">
              {project.description}
            </motion.p>
          </div>

          <motion.dl initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.48 }} className="mt-[clamp(44px,6vh,72px)] grid w-full max-w-3xl grid-cols-3 gap-[clamp(22px,4.5vw,72px)] border-y border-[#1e1e1e]/15 py-[clamp(22px,2.7vh,32px)] lg:mt-auto">
            {project.caseStudy.metrics.map((metric) => (
              <div key={metric.label}>
                <dd className="font-display text-[clamp(2.25rem,4.2vw,4.6rem)] font-black leading-none tracking-[-0.04em] text-[var(--project-accent-dark)]">{metric.value}</dd>
                <dt className="mt-2.5 max-w-[14ch] text-[7px] font-black uppercase leading-[1.45] tracking-[0.18em] text-[#1e1e1e]/48 sm:text-[8px]">{metric.label}</dt>
              </div>
            ))}
          </motion.dl>

          <button type="button" onClick={scrollToStory} aria-label="Ir para a próxima seção" className="group mt-[clamp(28px,3.5vh,42px)] grid size-11 place-items-center text-[#1e1e1e]/72 transition hover:translate-y-1 hover:text-[var(--project-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)]">
            <ArrowDownRight />
          </button>
        </div>
      </div>

      <motion.figure initial={prefersReducedMotion ? false : { opacity: 0, x: 70, scale: 0.94, filter: "blur(12px)" }} animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.1, ease: EASE, delay: 0.18 }} className="relative z-20 mt-6 h-[min(110vw,720px)] w-full lg:absolute lg:-bottom-[17vh] lg:right-[3vw] lg:mt-0 lg:h-[108%] lg:w-[53%]">
        <Image src="/images/gallery/blurr-hero.png" alt="" fill sizes="(max-width: 1023px) 100vw, 53vw" className="pointer-events-none translate-x-[14%] scale-[1.3] object-contain opacity-80 lg:translate-x-[22%]" />
        <Image src={project.heroMockup.src} alt={project.heroMockup.alt} fill sizes="(max-width: 1023px) 100vw, 53vw" className="relative z-10 object-contain object-center lg:object-right" priority />
        <figcaption className="sr-only">{project.heroMockup.title}</figcaption>
      </motion.figure>
    </section>
  )
}

type ProcessItem = {
  number: string
  eyebrow: string
  title: string
  description: string
  metric: string
  metricLabel: string
  detail?: string
}

type ProcessLabels = {
  kicker: string
  heading: string
  context: string
  direction: string
  impact: string
  challenge: string
  challengeBody: string
  followers: string
  directionBody: string
  views: string
  result: string
  resultBody: string
  active: string
  visualSystem: string
  selectedPieces: string
  next: string
  oneYear: string
  fiveMonths: string
}

function ProjectProcess({ project, labels }: { project: GalleryProject; labels: ProcessLabels }) {
  const reducedMotion = useReducedMotion()
  const isFrigideira = project.slug === "frigideira-ai"
  const isTocha = project.slug === "the-real-tocha"
  const isSdp = project.slug === "sdp"
  const metrics = project.caseStudy.metrics
  const items: ProcessItem[] = [
    {
      number: "01",
      eyebrow: labels.context,
      title: labels.challenge,
      description: isFrigideira ? labels.challengeBody : project.caseStudy.challenge,
      metric: isFrigideira ? "+200" : isTocha ? "+10K" : isSdp ? "+1.5K" : metrics[0]?.value ?? "—",
      metricLabel: isFrigideira || isTocha || isSdp ? labels.followers : metrics[0]?.label ?? labels.context,
    },
    {
      number: "02",
      eyebrow: labels.kicker,
      title: labels.direction,
      description: isFrigideira ? labels.directionBody : project.caseStudy.solution,
      metric: isFrigideira ? "+5K" : isTocha ? "+3M" : isSdp ? "+50K" : metrics[1]?.value ?? "—",
      metricLabel: isFrigideira || isTocha || isSdp ? labels.views : metrics[1]?.label ?? labels.kicker,
    },
    {
      number: "03",
      eyebrow: labels.impact,
      title: labels.result,
      description: isFrigideira ? labels.resultBody : project.caseStudy.result,
      metric: isFrigideira || isSdp ? "5" : isTocha ? "1" : metrics[2]?.value ?? "—",
      metricLabel: isFrigideira || isSdp ? labels.fiveMonths : isTocha ? labels.oneYear : metrics[2]?.label ?? labels.impact,
    },
  ]

  return (
    <section id="project-story" className="relative z-0 bg-[#1e1e1e] px-5 pb-[clamp(64px,7vw,104px)] pt-[clamp(150px,18vw,280px)] text-[#e8e7e7] sm:px-8 lg:px-[clamp(40px,4.6vw,88px)]">
      <motion.header
        initial={reducedMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="grid gap-3 border-b border-[#e8e7e7]/14 pb-[clamp(28px,4vw,52px)] lg:grid-cols-[7.5rem_1fr] lg:items-end"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--project-accent-soft)]">{labels.kicker}</p>
        <h2 className="max-w-[22ch] font-display text-[clamp(1.8rem,3.2vw,3.8rem)] font-black leading-[0.95] tracking-[-0.035em]">{labels.heading}</h2>
      </motion.header>

      <div>
        {items.map((item, index) => (
          <motion.article
            key={item.number}
            initial={reducedMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, delay: index * 0.05, ease: EASE }}
            className="grid gap-7 border-b border-[#e8e7e7]/14 py-[clamp(38px,5vw,72px)] md:grid-cols-[6rem_minmax(0,1fr)_minmax(16rem,1.1fr)] md:gap-x-8 lg:grid-cols-[7.5rem_minmax(17rem,0.9fr)_minmax(22rem,1.15fr)_minmax(12rem,0.55fr)] lg:items-center lg:gap-x-[clamp(28px,4vw,72px)]"
          >
            <div className="flex items-center justify-between md:block">
              <span className="font-display text-sm font-black tracking-[-0.03em] text-[var(--project-accent-soft)]">{item.number}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#e8e7e7]/38 md:mt-3 md:block">{item.eyebrow}</span>
            </div>
            <h3 className="font-display text-[clamp(2.7rem,5.6vw,6.6rem)] font-black uppercase leading-[0.78] tracking-[-0.065em]">{item.title}</h3>
            <p className="max-w-[50ch] text-[clamp(0.95rem,1.25vw,1.25rem)] leading-normal text-[#e8e7e7]/72 md:col-start-2 lg:col-start-auto">{item.description}</p>
            <motion.dl
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.75, delay: reducedMotion ? 0 : 0.16, ease: EASE }}
              className="md:col-start-3 md:justify-self-end md:text-right lg:col-start-auto"
            >
              <dd className="font-display text-[clamp(3.5rem,6.4vw,7.5rem)] font-black uppercase leading-[0.72] tracking-[-0.075em]">{item.metric}</dd>
              <dt className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#e8e7e7]/58">{item.metricLabel}</dt>
              {item.detail ? <dt className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-[var(--project-accent-soft)]">{item.detail}</dt> : null}
            </motion.dl>
          </motion.article>
        ))}
      </div>

      <a href="#visual-system" className="group ml-auto mt-[clamp(36px,5vw,64px)] flex w-max items-end gap-5 text-right focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7]">
        <span>
          <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-[#e8e7e7]/38">{labels.next}</span>
          <span className="mt-2 block font-display text-[clamp(1.4rem,2.5vw,2.8rem)] font-black uppercase leading-none tracking-[-0.04em] transition group-hover:text-[var(--project-accent-soft)]">{labels.visualSystem}</span>
        </span>
        <span className="transition group-hover:translate-y-1"><ArrowDownRight /></span>
      </a>
    </section>
  )
}

function GalleryFigure({ asset, index, rhythm, onOpen, reducedMotion }: { asset: EditorialAsset; index: number; rhythm: ProjectRhythm; onOpen: (carousel: GalleryCarousel) => void; reducedMotion: boolean }) {
  const isMockup = asset.kind === "mockup"
  const isStory = asset.kind === "story"
  const layoutClass = isMockup ? mockupLayout[(index + rhythm.mockupOffset) % mockupLayout.length] : galleryLayout[(index + rhythm.galleryOffset) % galleryLayout.length]
  const aspectClass = isMockup ? "aspect-[16/10]" : isStory ? "aspect-[9/16]" : (index + rhythm.galleryOffset) % 5 === 4 ? "aspect-square" : "aspect-[4/5]"
  const motionProps = reducedMotion
    ? {}
    : {
        variants: galleryItemVariants,
        whileHover: { y: -6, scale: 1.012, transition: { duration: 0.45, ease: EASE } },
      }

  const content = (
    <>
      <span className={`relative block overflow-visible ${aspectClass}`}>
        <Image
          src={asset.image.src}
          alt={asset.image.alt}
          fill
          sizes={isMockup ? "(max-width: 768px) 86vw, 42vw" : "(max-width: 768px) 42vw, 22vw"}
          className="object-contain drop-shadow-[0_22px_55px_rgba(30,30,30,0.08)] transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.018] group-hover:drop-shadow-[0_30px_70px_rgba(30,30,30,0.12)]"
          priority={asset.priority}
        />
      </span>
      <span className="mt-4 flex items-center justify-between gap-5 border-t border-[#1e1e1e]/10 pt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#1e1e1e]/42">
        <span>{asset.label}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </span>
      <span className="mt-2 block max-w-[24ch] text-xs font-semibold leading-snug text-[#1e1e1e]/58 sm:text-sm">{asset.carousel?.title ?? asset.image.title}</span>
    </>
  )

  if (asset.carousel) {
    return (
      <motion.button
        type="button"
        onClick={() => onOpen(asset.carousel as GalleryCarousel)}
        className={`group text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)] ${layoutClass}`}
        aria-label={`Abrir carrossel ${asset.carousel.title}`}
        {...motionProps}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <motion.figure className={`group ${layoutClass}`} {...motionProps}>
      {content}
    </motion.figure>
  )
}

function EditorialGallery({ project, assets, labels, rhythm, onOpen }: { project: GalleryProject; assets: EditorialAsset[]; labels: { eyebrow: string; title: string; description: string }; rhythm: ProjectRhythm; onOpen: (carousel: GalleryCarousel) => void }) {
  const reducedMotion = useReducedMotion()

  return (
    <section id="designs" className="min-h-svh scroll-mt-0 border-t border-[#1e1e1e]/12 px-4 py-[clamp(64px,9vw,128px)] sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--project-accent-dark)]">{labels.eyebrow}</p>
          <h2 className="mt-5 max-w-[10ch] text-balance font-display text-[clamp(3.6rem,10vw,10.8rem)] font-black leading-[0.8] tracking-[0] text-[#030303]">
            {labels.title}
          </h2>
          <p className="mt-5 max-w-[48ch] text-[10px] font-black uppercase tracking-[0.18em] text-[#1e1e1e]/42">{project.formats.join(" · ")}</p>
        </div>
        <p className="max-w-[34ch] text-lg font-semibold leading-relaxed text-[#1e1e1e]/60 sm:text-xl lg:col-span-4 lg:col-start-9">
          {labels.description}
        </p>
      </div>

      <motion.div
        variants={reducedMotion ? undefined : galleryGroupVariants}
        initial={reducedMotion ? false : "hidden"}
        whileInView={reducedMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.12 }}
        className="mt-[clamp(46px,8vw,112px)] grid auto-rows-auto grid-cols-2 items-start gap-x-[clamp(22px,5vw,86px)] gap-y-[clamp(56px,9vw,150px)] sm:grid-cols-4 lg:grid-cols-12"
      >
        {assets.map((asset, index) => (
          <GalleryFigure key={`${asset.kind}-${asset.image.src}`} asset={asset} index={index} rhythm={rhythm} onOpen={onOpen} reducedMotion={Boolean(reducedMotion)} />
        ))}
      </motion.div>
    </section>
  )
}

function FinalCta({ nextProject, labels }: { nextProject: GalleryProject; labels: { eyebrow: string; title: string; body: string; gallery: string } }) {
  return (
    <section className="grid min-h-[92svh] items-end bg-[#1e1e1e] px-4 py-[clamp(72px,10vw,132px)] text-[#e8e7e7] sm:px-6">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.38fr)] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e8e7e7]/48">{labels.eyebrow}</p>
          <h2 className="mt-5 max-w-[10ch] text-balance font-display text-[clamp(3.8rem,10vw,11rem)] font-black leading-[0.78] tracking-[0]">
            {labels.title}
          </h2>
        </div>
        <div>
          <p className="max-w-[36ch] text-lg font-semibold leading-relaxed text-[#e8e7e7]/64">
            {labels.body}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/gallery" className="inline-flex items-center justify-center border border-[#e8e7e7]/24 px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7]">
              <RollingText variant="strong">{labels.gallery}</RollingText>
            </Link>
            <Link href={`/gallery/${nextProject.slug}`} className="inline-flex items-center justify-center bg-[#e8e7e7] px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#1e1e1e] transition hover:bg-[var(--project-accent)] hover:text-[#e8e7e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)]">
              <RollingText variant="strong">{nextProject.name}</RollingText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function CarouselViewer({ viewer, projectName, labels, onClose, onStep, onSelect }: { viewer: ViewerState; projectName: string; labels: { close: string; previous: string; next: string; goToSlide: string }; onClose: () => void; onStep: (direction: 1 | -1) => void; onSelect: (index: number) => void }) {
  const slide = viewer.carousel.slides[viewer.index]

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") onStep(1)
      if (event.key === "ArrowLeft") onStep(-1)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose, onStep])

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1e1e]/94 px-4 py-5 text-[#e8e7e7] backdrop-blur-md sm:px-8" role="dialog" aria-modal="true" aria-label={viewer.carousel.title}>
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-[#e8e7e7]/14 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e8e7e7]/54">{projectName}</p>
            <h3 className="mt-1 font-display text-[clamp(1.8rem,4vw,4rem)] font-black leading-none tracking-[0]">{viewer.carousel.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/25 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7]" aria-label={labels.close}>
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 items-center gap-4 py-5 sm:grid-cols-[56px_minmax(0,1fr)_56px]">
          <button type="button" onClick={() => onStep(-1)} className="hidden size-12 place-items-center rounded-full border border-[#e8e7e7]/24 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7] sm:grid" aria-label={labels.previous}>
            ←
          </button>

          <div className="relative mx-auto h-full min-h-105 w-full max-w-[min(86vw,760px)]">
            <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 768px) 92vw, 760px" className="object-contain" priority />
          </div>

          <button type="button" onClick={() => onStep(1)} className="hidden size-12 place-items-center rounded-full border border-[#e8e7e7]/24 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7] sm:grid" aria-label={labels.next}>
            →
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#e8e7e7]/14 pt-4">
          <button type="button" onClick={() => onStep(-1)} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/24 text-xl sm:hidden" aria-label={labels.previous}>
            ←
          </button>
          <div className="flex flex-1 items-center justify-center gap-2">
            {viewer.carousel.slides.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onSelect(index)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--project-accent)] ${index === viewer.index ? "w-10 bg-[var(--project-accent)]" : "w-4 bg-[#e8e7e7]/28 hover:bg-[var(--project-accent-soft)]"}`}
                aria-label={`${labels.goToSlide} ${index + 1}`}
                aria-current={index === viewer.index}
              />
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e8e7e7]/58">
            {String(viewer.index + 1).padStart(2, "0")} / {String(viewer.carousel.slides.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => onStep(1)} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/24 text-xl sm:hidden" aria-label={labels.next}>
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectGalleryDetail({ project: projectConfig }: { project: GalleryProjectConfig }) {
  const { t } = useI18n()
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const project = useMemo(() => getTranslatedGalleryProject(projectConfig, t), [projectConfig, t])
  const nextProject = useMemo(() => getNextGalleryProject(project.slug, t), [project.slug, t])
  const rhythm = useMemo(() => getRhythm(project.slug), [project.slug])
  const labels = useMemo(
    () => ({
      hero: { back: t("galleryDetailBack") },
      process: {
        kicker: t("galleryProcessKicker"), heading: t("galleryProcessHeading"), context: t("galleryProcessContext"), direction: t("galleryProcessDirection"), impact: t("galleryProcessImpact"),
        challenge: t("galleryProcessChallenge"), challengeBody: t("galleryProcessChallengeBody"), followers: t("galleryProcessFollowers"), directionBody: t("galleryProcessDirectionBody"),
        views: t("galleryProcessViews"), result: t("galleryProcessResult"), resultBody: t("galleryProcessResultBody"), active: t("galleryProcessActive"), visualSystem: t("galleryProcessVisualSystem"),
        selectedPieces: t("galleryProcessSelectedPieces"), next: t("galleryProcessNext"), oneYear: t("galleryProcessOneYear"), fiveMonths: t("galleryProcessFiveMonths"),
      },
      asset: { mockup: t("galleryDetailAssetMockup"), post: t("galleryDetailAssetPost"), story: t("galleryDetailAssetStory"), slides: t("galleryDetailAssetSlides") },
      gallery: { eyebrow: t("galleryDetailEditorialEyebrow"), title: t("galleryDetailEditorialTitle"), description: t("galleryDetailEditorialDescription") },
      visualSystem: {
        system: t("galleryVisualSystem"), objective: t("galleryVisualObjective"), purpose: t("galleryVisualPurpose"),
        typography: t("galleryVisualTypography"), colors: t("galleryVisualColors"), next: t("galleryProcessNext"), designs: t("galleryVisualDesigns"),
      },
      cta: { eyebrow: t("galleryDetailCtaEyebrow"), title: t("galleryDetailCtaTitle"), body: t("galleryDetailCtaBody"), gallery: t("galleryDetailCtaGallery") },
      viewer: { close: t("galleryDetailViewerClose"), previous: t("galleryDetailViewerPrevious"), next: t("galleryDetailViewerNext"), goToSlide: t("galleryDetailViewerGoToSlide") },
    }),
    [t],
  )
  const assets = useMemo(() => buildEditorialAssets(project, labels.asset), [project, labels.asset])

  useEffect(() => {
    document.title = `${project.name} | ${t("galleryDetailMetaSuffix")}`
    document.querySelector('meta[name="description"]')?.setAttribute("content", project.description)
  }, [project.description, project.name, t])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--page-accent", project.theme.accent)
    root.style.setProperty("--page-accent-dark", project.theme.accentDark)
    return () => {
      root.style.removeProperty("--page-accent")
      root.style.removeProperty("--page-accent-dark")
    }
  }, [project.theme])

  const themeStyles = {
    "--project-accent": project.theme.accent,
    "--project-accent-dark": project.theme.accentDark,
    "--project-accent-soft": project.theme.accentSoft,
    "--project-glow": project.theme.glow,
    "--accent": project.theme.accent,
  } as CSSProperties

  const stepViewer = (direction: 1 | -1) => {
    setViewer((current) => {
      if (!current) return current
      const total = current.carousel.slides.length
      return { ...current, index: (current.index + direction + total) % total }
    })
  }

  return (
    <div style={themeStyles} data-project-theme={project.slug} className="min-h-svh max-w-full overflow-x-clip bg-[#e8e7e7] text-[#1e1e1e]">
      <ScrollProgress />
      <HeroSection project={project} backLabel={labels.hero.back} />

      <ProjectProcess project={project} labels={labels.process} />
      <VisualSystem system={project.visualSystem} labels={labels.visualSystem} />
      <EditorialGallery project={project} assets={assets} labels={labels.gallery} rhythm={rhythm} onOpen={(carousel) => setViewer({ carousel, index: 0 })} />
      <FinalCta nextProject={nextProject} labels={labels.cta} />

      {viewer ? <CarouselViewer viewer={viewer} projectName={project.name} labels={labels.viewer} onClose={() => setViewer(null)} onStep={stepViewer} onSelect={(index) => setViewer((current) => (current ? { ...current, index } : current))} /> : null}
    </div>
  )
}
