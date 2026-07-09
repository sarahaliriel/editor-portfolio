"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import MotionCta from "@/components/shared/motion-cta"

type GalleryImage = {
  src: string
  alt: string
  title: string
  shape?: "wide" | "tall" | "feature"
}

type Carousel = {
  title: string
  slides: GalleryImage[]
}

type GalleryProject = {
  name: string
  year: string
  type: string
  description: string
  pieces: GalleryImage[]
  carousels?: Carousel[]
  stories?: GalleryImage[]
}

type ViewerState = {
  project: string
  carousel: Carousel
  index: number
}

const image = (id: number, title: string, shape?: GalleryImage["shape"]): GalleryImage => ({
  src: `/images/gallery/post-${String(id).padStart(2, "0")}.png`,
  alt: title,
  title,
  shape,
})

const projects: GalleryProject[] = [
  {
    name: "Frigideira AI",
    year: "2026",
    type: "Direção de arte · Social media",
    description: "Conteúdo visual para tornar tecnologia, IA e cultura digital mais claros, compartilháveis e reconhecíveis.",
    pieces: [
      image(1, "Post manifesto", "feature"),
      image(2, "Peça educativa"),
      image(3, "Chamada editorial", "tall"),
      image(4, "Conteúdo técnico"),
      image(5, "Frame de autoridade", "wide"),
      image(6, "Post de comunidade"),
    ],
    carousels: [
      {
        title: "IA aplicada ao cotidiano",
        slides: [
          image(7, "Capa do carrossel IA aplicada"),
          image(8, "Slide 02"),
          image(9, "Slide 03"),
          image(10, "Slide 04"),
        ],
      },
    ],
  },
  {
    name: "The Real Tocha",
    year: "2025 - 2026",
    type: "Identidade visual · Conteúdo de autoridade",
    description: "Peças para transformar temas densos de empreendedorismo, investimento e comunicação em presença digital clara e forte.",
    pieces: [
      image(11, "Post de autoridade", "feature"),
      image(12, "Frame de análise"),
      image(13, "Peça de posicionamento", "tall"),
      image(14, "Conteúdo educativo"),
      image(15, "Post de retenção", "wide"),
      image(16, "Chamada social"),
    ],
    carousels: [
      {
        title: "Narrativa para negócios digitais",
        slides: [
          image(17, "Capa do carrossel negócios digitais"),
          image(18, "Slide 02"),
          image(19, "Slide 03"),
          image(20, "Slide 04"),
        ],
      },
    ],
    stories: [
      image(21, "Story de abertura"),
      image(22, "Story de sequência"),
      image(23, "Story de fechamento"),
    ],
  },
  {
    name: "SDP",
    year: "2026",
    type: "Comunidade tech · Social media",
    description: "Sistema visual para uma comunidade de tecnologia em crescimento, unindo campanhas, eventos e comunicação recorrente.",
    pieces: [
      image(24, "Post institucional", "feature"),
      image(25, "Chamada de evento"),
      image(26, "Peça de comunidade", "tall"),
      image(27, "Anúncio social"),
      image(28, "Conteúdo de campanha", "wide"),
      image(29, "Post de engajamento"),
      image(30, "Visual de apoio"),
    ],
    carousels: [
      {
        title: "Comunidade em movimento",
        slides: [
          image(31, "Capa do carrossel comunidade"),
          image(32, "Slide 02"),
          image(33, "Slide 03"),
          image(34, "Slide 04"),
        ],
      },
    ],
  },
]

const playground: GalleryImage[] = [
  image(35, "Estudo de composição", "feature"),
  image(36, "Exploração tipográfica"),
  image(37, "Conceito visual", "tall"),
  image(38, "Peça experimental"),
  image(39, "Direção visual livre", "wide"),
]

const pieceClass = {
  feature: "lg:col-span-5 lg:row-span-2",
  wide: "lg:col-span-4",
  tall: "lg:col-span-3 lg:row-span-2",
  default: "lg:col-span-3",
}

function PieceCard({ piece, index }: { piece: GalleryImage; index: number }) {
  const shape = piece.shape ?? "default"

  return (
    <figure className={`group relative overflow-hidden border border-[#1e1e1e]/10 bg-[#dedddd] ${pieceClass[shape]}`}>
      <div className={`relative ${shape === "wide" ? "aspect-5/4" : shape === "tall" ? "aspect-4/5 lg:h-full" : "aspect-4/5"}`}>
        <Image
          src={piece.src}
          alt={piece.alt}
          fill
          sizes="(max-width: 768px) 92vw, 34vw"
          className="object-cover transition duration-700 group-hover:scale-[1.025]"
          priority={index < 3}
        />
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-[#1e1e1e]/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1e]/56">
        <span>{piece.title}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </figcaption>
    </figure>
  )
}

function CarouselCard({ project, carousel, onOpen }: { project: string; carousel: Carousel; onOpen: () => void }) {
  const cover = carousel.slides[0]

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative grid min-h-[360px] overflow-hidden border border-[#1e1e1e]/12 bg-[#1e1e1e] text-left text-[#e8e7e7] outline-none transition duration-500 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1800ad]"
      aria-label={`Abrir carrossel ${carousel.title}`}
    >
      <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 768px) 92vw, 42vw" className="object-cover opacity-72 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-48" />
      <span className="absolute left-5 top-5 rounded-full border border-[#e8e7e7]/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
        carrossel
      </span>
      <span className="absolute right-5 top-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8e7e7]/68">
        {carousel.slides.length} slides
      </span>
      <span className="relative z-10 mt-auto block p-5 sm:p-7">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8e7e7]/62">{project}</span>
        <span className="mt-3 block font-display text-[clamp(2rem,5vw,4.6rem)] font-extrabold leading-[0.88] tracking-[-0.055em]">
          {carousel.title}
        </span>
        <span className="mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8e7e7]">
          abrir <span className="text-lg transition-transform duration-500 group-hover:translate-x-1">↗</span>
        </span>
      </span>
    </button>
  )
}

function StoriesStrip({ stories }: { stories: GalleryImage[] }) {
  return (
    <div className="mt-8 border-t border-[#1e1e1e]/10 pt-8">
      <div className="mb-5 flex items-end justify-between gap-6">
        <h4 className="font-display text-[clamp(1.8rem,4vw,3.8rem)] font-extrabold leading-none tracking-[-0.05em]">Stories</h4>
        <p className="max-w-[24ch] text-right text-xs uppercase tracking-[0.16em] text-[#1e1e1e]/46">formato vertical</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stories.map((story, index) => (
          <figure key={story.src} className="overflow-hidden border border-[#1e1e1e]/10 bg-[#dedddd]">
            <div className="relative mx-auto aspect-9/16 max-h-160">
              <Image src={story.src} alt={story.alt} fill sizes="(max-width: 768px) 86vw, 28vw" className="object-cover" />
            </div>
            <figcaption className="border-t border-[#1e1e1e]/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1e]/54">
              Story {String(index + 1).padStart(2, "0")}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

function ProjectSection({ project, onOpen }: { project: GalleryProject; onOpen: (carousel: Carousel) => void }) {
  const pieceCount = project.pieces.length + (project.stories?.length ?? 0) + (project.carousels?.reduce((total, carousel) => total + carousel.slides.length, 0) ?? 0)

  return (
    <section className="border-t border-[#1e1e1e]/12 py-[clamp(56px,10vw,128px)]">
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.5fr)] lg:gap-14">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1800ad]">{project.year}</p>
          <h2 className="mt-4 max-w-[8ch] font-display text-[clamp(3.2rem,8vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.075em]">
            {project.name}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#1e1e1e]/12 py-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1e]/58 sm:grid-cols-3 lg:grid-cols-1">
            <span>{project.type}</span>
            <span>{pieceCount} peças</span>
            <span>ordem manual</span>
          </div>
          <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-[#1e1e1e]/68 sm:text-base">{project.description}</p>
        </div>

        <div className="min-w-0">
          <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8 lg:gap-5">
            {project.pieces.map((piece, index) => (
              <PieceCard key={piece.src} piece={piece} index={index} />
            ))}
          </div>

          {project.carousels?.length ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {project.carousels.map((carousel) => (
                <CarouselCard key={carousel.title} project={project.name} carousel={carousel} onOpen={() => onOpen(carousel)} />
              ))}
            </div>
          ) : null}

          {project.stories?.length ? <StoriesStrip stories={project.stories} /> : null}
        </div>
      </div>
    </section>
  )
}

function CarouselViewer({ viewer, onClose, onStep, onSelect }: { viewer: ViewerState; onClose: () => void; onStep: (direction: 1 | -1) => void; onSelect: (index: number) => void }) {
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
    <div className="fixed inset-0 z-50 bg-[#1e1e1e]/92 px-4 py-5 text-[#e8e7e7] backdrop-blur-md sm:px-8" role="dialog" aria-modal="true" aria-label={viewer.carousel.title}>
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-[#e8e7e7]/14 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8e7e7]/54">{viewer.project}</p>
            <h3 className="mt-1 font-display text-[clamp(1.8rem,4vw,4rem)] font-extrabold leading-none tracking-[-0.055em]">{viewer.carousel.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/25 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7]" aria-label="Fechar viewer">
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 items-center gap-4 py-5 sm:grid-cols-[56px_minmax(0,1fr)_56px]">
          <button type="button" onClick={() => onStep(-1)} className="hidden size-12 place-items-center rounded-full border border-[#e8e7e7]/24 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7] sm:grid" aria-label="Slide anterior">
            ←
          </button>

          <div className="relative mx-auto h-full min-h-105 w-full max-w-[min(86vw,760px)]">
            <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 768px) 92vw, 760px" className="object-contain" priority />
          </div>

          <button type="button" onClick={() => onStep(1)} className="hidden size-12 place-items-center rounded-full border border-[#e8e7e7]/24 text-2xl transition hover:bg-[#e8e7e7] hover:text-[#1e1e1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8e7e7] sm:grid" aria-label="Próximo slide">
            →
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#e8e7e7]/14 pt-4">
          <button type="button" onClick={() => onStep(-1)} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/24 text-xl sm:hidden" aria-label="Slide anterior">
            ←
          </button>
          <div className="flex flex-1 items-center justify-center gap-2">
            {viewer.carousel.slides.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onSelect(index)}
                className={`h-1.5 rounded-full transition-all ${index === viewer.index ? "w-10 bg-[#e8e7e7]" : "w-4 bg-[#e8e7e7]/28"}`}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={index === viewer.index}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8e7e7]/58">
            {String(viewer.index + 1).padStart(2, "0")} / {String(viewer.carousel.slides.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => onStep(1)} className="grid size-11 place-items-center rounded-full border border-[#e8e7e7]/24 text-xl sm:hidden" aria-label="Próximo slide">
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DesignGallery() {
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const totalPieces = useMemo(
    () =>
      projects.reduce(
        (total, project) =>
          total +
          project.pieces.length +
          (project.stories?.length ?? 0) +
          (project.carousels?.reduce((carouselTotal, carousel) => carouselTotal + carousel.slides.length, 0) ?? 0),
        playground.length,
      ),
    [],
  )

  const openCarousel = (project: string, carousel: Carousel) => {
    setViewer({ project, carousel, index: 0 })
  }

  const stepViewer = (direction: 1 | -1) => {
    setViewer((current) => {
      if (!current) return current
      const total = current.carousel.slides.length
      return { ...current, index: (current.index + direction + total) % total }
    })
  }

  return (
    <div className="min-h-svh bg-[#e8e7e7] text-[#1e1e1e]">
      <section className="container-bleed flex min-h-[92svh] flex-col justify-between pb-[clamp(34px,7vw,88px)] pt-[clamp(92px,13vw,154px)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#1800ad]">arquivo visual</p>
            <h1 className="mt-6 max-w-[9ch] font-display text-[clamp(4.8rem,16vw,15.5rem)] font-extrabold leading-[0.76] tracking-[-0.085em]">
              Design Gallery
            </h1>
          </div>
          <div className="lg:pb-5">
            <p className="max-w-[40ch] text-[clamp(1rem,2vw,1.45rem)] leading-snug text-[#1e1e1e]/70">
              Uma coleção de posts, carrosséis e peças visuais criadas para transformar ideias em presença digital.
            </p>
            <div className="mt-8 grid grid-cols-3 border-y border-[#1e1e1e]/12 py-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1e]/58">
              <span>{projects.length} projetos</span>
              <span>{totalPieces} peças</span>
              <span>manual order</span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[image(1, "Preview Frigideira AI"), image(11, "Preview The Real Tocha"), image(24, "Preview SDP"), image(35, "Preview Creative Playground")].map((item, index) => (
            <figure key={item.src} className={`relative overflow-hidden border border-[#1e1e1e]/10 bg-[#dedddd] ${index % 2 ? "mt-8" : ""}`}>
              <div className="relative aspect-4/5">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 44vw, 22vw" className="object-cover grayscale transition duration-700 hover:grayscale-0" priority />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <div className="container-bleed">
        {projects.map((project) => (
          <ProjectSection key={project.name} project={project} onOpen={(carousel) => openCarousel(project.name, carousel)} />
        ))}

        <section className="border-t border-[#1e1e1e]/12 py-[clamp(56px,10vw,128px)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.5fr)] lg:gap-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1800ad]">estudos e conceitos</p>
              <h2 className="mt-4 max-w-[10ch] font-display text-[clamp(3.2rem,8vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.075em]">
                Creative Playground
              </h2>
              <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-[#1e1e1e]/68 sm:text-base">
                Nem toda ideia vira um projeto completo. Algumas existem para testar linguagem, experimentar composições e descobrir novas direções visuais.
              </p>
            </div>
            <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8 lg:gap-5">
              {playground.map((piece, index) => (
                <PieceCard key={piece.src} piece={piece} index={index} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#1e1e1e] px-4 py-[clamp(72px,12vw,148px)] text-[#e8e7e7] sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e8e7e7]/46">motion</p>
            <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(3.6rem,9vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.075em]">
              Quando o design começa a se mover.
            </h2>
          </div>
          <div className="max-w-[38ch]">
            <p className="text-base leading-relaxed text-[#e8e7e7]/64">
              Depois da composição, vem o ritmo. Veja como algumas ideias ganham narrativa através da edição.
            </p>
            <MotionCta href="/allprojects" className="mt-8">Ver projetos em vídeo</MotionCta>
          </div>
        </div>
      </section>

      {viewer ? <CarouselViewer viewer={viewer} onClose={() => setViewer(null)} onStep={stepViewer} onSelect={(index) => setViewer((current) => (current ? { ...current, index } : current))} /> : null}
    </div>
  )
}
