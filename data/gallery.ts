export type GalleryImage = {
  src: string
  alt: string
  title: string
  shape?: "wide" | "tall" | "feature"
}

export type GalleryCarousel = {
  title: string
  slides: GalleryImage[]
}

export type GalleryProject = {
  name: string
  year: string
  type: string
  description: string
  pieces: GalleryImage[]
  carousels?: GalleryCarousel[]
  stories?: GalleryImage[]
}

export type GalleryShot = {
  src: string
  alt: string
  w: number
  h: number
}

const image = (src: string, title: string, shape?: GalleryImage["shape"]): GalleryImage => ({
  src,
  alt: title,
  title,
  shape,
})

const galleryPath = (project: string, folder: string, file: string) => `/images/gallery/${project}/${folder}/${file}`

const staticImage = (project: string, file: string, title: string, shape?: GalleryImage["shape"]) =>
  image(galleryPath(project, "estaticos", file), title, shape)

const storyImage = (file: string, title: string) => image(galleryPath("the-real-tocha", "stories", file), title)

const carouselSlides = (project: string, post: number, slideNumbers: number[], title: string): GalleryCarousel => ({
  title,
  slides: slideNumbers.map((slide, index) =>
    image(
      galleryPath(project, `carrossel/post-${String(post).padStart(2, "0")}`, `${String(slide).padStart(2, "0")}.png`),
      index === 0 ? `Capa do carrossel ${title}` : `Slide ${String(index + 1).padStart(2, "0")}`,
    ),
  ),
})

export const galleryProjects: GalleryProject[] = [
  {
    name: "Frigideira AI",
    year: "2026",
    type: "Direção de arte · Social media",
    description: "Conteúdo visual para tornar tecnologia, IA e cultura digital mais claros, compartilháveis e reconhecíveis.",
    pieces: [
      staticImage("frigideira-ai", "01.png", "Post manifesto", "feature"),
      staticImage("frigideira-ai", "02.png", "Peça educativa"),
      staticImage("frigideira-ai", "03.png", "Chamada editorial", "tall"),
      staticImage("frigideira-ai", "04.png", "Conteúdo técnico"),
      staticImage("frigideira-ai", "05.png", "Frame de autoridade", "wide"),
    ],
    carousels: [
      carouselSlides("frigideira-ai", 1, [1, 2, 3, 4, 5, 6], "IA aplicada ao cotidiano"),
      carouselSlides("frigideira-ai", 2, [1, 2, 3, 4, 5, 6], "Processo visual e clareza"),
      carouselSlides("frigideira-ai", 3, [1, 2, 3, 4, 5], "Narrativa de tecnologia"),
      carouselSlides("frigideira-ai", 4, [1, 2, 3, 4, 5], "Conteúdo para comunidade"),
    ],
  },
  {
    name: "The Real Tocha",
    year: "2025 - 2026",
    type: "Identidade visual · Conteúdo de autoridade",
    description: "Peças para transformar temas densos de empreendedorismo, investimento e comunicação em presença digital clara e forte.",
    pieces: [
      staticImage("the-real-tocha", "01.png", "Post de autoridade", "feature"),
      staticImage("the-real-tocha", "02.png", "Frame de análise"),
      staticImage("the-real-tocha", "03.png", "Peça de posicionamento", "tall"),
      staticImage("the-real-tocha", "04.png", "Conteúdo educativo"),
      staticImage("the-real-tocha", "05.png", "Post de retenção", "wide"),
      staticImage("the-real-tocha", "06.png", "Chamada social"),
      staticImage("the-real-tocha", "07.png", "Post de comunidade"),
    ],
    carousels: [
      carouselSlides("the-real-tocha", 1, [1, 2, 3, 4, 5], "Narrativa para negócios digitais"),
      carouselSlides("the-real-tocha", 2, [1, 2, 3, 4, 5], "Autoridade e presença"),
      carouselSlides("the-real-tocha", 3, [1, 2, 3, 4, 5, 6, 7], "Educação visual"),
      carouselSlides("the-real-tocha", 4, [1, 2, 3, 4, 5, 6], "Ritmo editorial"),
      carouselSlides("the-real-tocha", 5, [1, 2, 3, 4, 5, 6, 7], "Investimento e comunicação"),
      carouselSlides("the-real-tocha", 6, [1, 2, 3, 4, 5, 6], "Construção de repertório"),
      carouselSlides("the-real-tocha", 7, [1, 2, 3, 4, 5, 6, 7, 8], "Sequência de autoridade"),
      carouselSlides("the-real-tocha", 8, [1, 2, 3, 4, 5, 6, 7], "Clareza para conversão"),
      carouselSlides("the-real-tocha", 9, [1, 2, 3, 4, 5], "Mensagem de impacto"),
    ],
    stories: [
      storyImage("01.png", "Story de abertura"),
      storyImage("02.png", "Story de sequência"),
      storyImage("03.png", "Story de desenvolvimento"),
      storyImage("04.png", "Story de fechamento"),
    ],
  },
  {
    name: "SDP",
    year: "2026",
    type: "Comunidade tech · Social media",
    description: "Sistema visual para uma comunidade de tecnologia em crescimento, unindo campanhas, eventos e comunicação recorrente.",
    pieces: [],
    carousels: [
      carouselSlides("servidor-programadores", 1, [1, 2, 3], "Comunidade em movimento"),
      carouselSlides("servidor-programadores", 2, [1, 2, 3, 4, 5], "Programação e comunidade"),
      carouselSlides("servidor-programadores", 3, [1, 2], "Chamada editorial"),
      carouselSlides("servidor-programadores", 4, [1, 2, 3], "Campanha tech"),
      carouselSlides("servidor-programadores", 5, [1, 2], "Engajamento da comunidade"),
      carouselSlides("servidor-programadores", 6, [4, 5, 6, 7, 8, 9, 10], "Sequência especial"),
    ],
  },
]

export const playgroundPieces: GalleryImage[] = [
  staticImage("playground", "01.png", "Estudo de composição", "feature"),
  staticImage("playground", "02.png", "Exploração tipográfica"),
  staticImage("playground", "03.png", "Conceito visual", "tall"),
  staticImage("playground", "04.png", "Peça experimental"),
  staticImage("playground", "05.png", "Direção visual livre", "wide"),
  staticImage("playground", "06-save-our-seas.png", "Save Our Seas", "feature"),
  staticImage("playground", "07.png", "Estudo visual livre"),
]

export const playgroundLogos: GalleryImage[] = [
  image("/images/gallery/playground/logo/01-save-our-seas.png", "Logo Save Our Seas"),
]

export const galleryPreviewImages: GalleryImage[] = [
  galleryProjects[0].pieces[0],
  galleryProjects[1].pieces[0],
  galleryProjects[2].carousels?.[0]?.slides[0],
  playgroundPieces[0],
].filter(Boolean) as GalleryImage[]

export const galleryShots: GalleryShot[] = [
  ...galleryProjects.flatMap((project) => [
    ...project.pieces,
    ...(project.stories ?? []),
    ...(project.carousels ?? []).map((carousel) => carousel.slides[0]),
  ]),
  ...playgroundPieces,
].map((shot) => ({
  src: shot.src,
  alt: shot.alt,
  w: 1080,
  h: 1080,
}))
