import type { I18nKey } from "@/components/providers/i18n"

type Translate = (key: I18nKey) => string

export type GalleryImage = {
  src: string
  alt: string
  title: string
  shape?: "wide" | "tall" | "feature"
}

type GalleryImageConfig = {
  src: string
  titleKey: I18nKey
  shape?: GalleryImage["shape"]
}

export type GalleryCarousel = {
  title: string
  slides: GalleryImage[]
}

type GalleryCarouselConfig = {
  titleKey: I18nKey
  slides: GalleryImageConfig[]
}

export type GalleryMetric = {
  value: string
  label: string
}

type GalleryMetricConfig = {
  count: "pieces" | "carousels" | "stories" | "slides" | "mockup"
  labelKey: I18nKey
}

export type GalleryCaseStudy = {
  intro: string
  challenge: string
  solution: string
  result: string
  metrics: GalleryMetric[]
}

export type GalleryVisualSystem = {
  objective: string
  objectiveBody: string
  fonts: { name: string; role: string; family?: string }[]
  colors: { hex: string; role: string }[]
  objectiveMockup: GalleryImage
}

export type GalleryProject = {
  name: string
  heroTitle?: string
  slug: string
  year: string
  type: string
  role: string
  formats: string[]
  tools: string[]
  description: string
  heroMockup: GalleryImage
  caseStudy: GalleryCaseStudy
  visualSystem: GalleryVisualSystem
  pieces: GalleryImage[]
  carousels?: GalleryCarousel[]
  stories?: GalleryImage[]
}

export type GalleryProjectConfig = {
  nameKey: I18nKey
  heroTitleKey?: I18nKey
  slug: string
  year: string
  typeKey: I18nKey
  roleKey: I18nKey
  formatsKeys: I18nKey[]
  tools: string[]
  descriptionKey: I18nKey
  heroMockup: GalleryImageConfig
  caseStudy: {
    introKey: I18nKey
    challengeKey: I18nKey
    solutionKey: I18nKey
    resultKey: I18nKey
    metrics: GalleryMetricConfig[]
  }
  visualSystem: {
    objectiveKey: I18nKey
    objectiveBodyKey: I18nKey
    fonts: { name: string; roleKey: I18nKey; family?: string }[]
    colors: { hex: string; roleKey: I18nKey }[]
    objectiveMockup: GalleryImageConfig
  }
  pieces: GalleryImageConfig[]
  carousels?: GalleryCarouselConfig[]
  stories?: GalleryImageConfig[]
}

const image = (src: string, titleKey: I18nKey, shape?: GalleryImage["shape"]): GalleryImageConfig => ({
  src,
  titleKey,
  shape,
})

const galleryPath = (project: string, folder: string, file: string) => `/images/gallery/${project}/${folder}/${file}`

const staticImage = (project: string, file: string, titleKey: I18nKey, shape?: GalleryImage["shape"]) =>
  image(galleryPath(project, "estaticos", file), titleKey, shape)

const storyImage = (file: string, titleKey: I18nKey) => image(galleryPath("the-real-tocha", "stories", file), titleKey)

const carouselSlides = (project: string, post: number, slideNumbers: number[], titleKey: I18nKey): GalleryCarouselConfig => ({
  titleKey,
  slides: slideNumbers.map((slide, index) =>
    image(
      galleryPath(project, `carrossel/post-${String(post).padStart(2, "0")}`, `${String(slide).padStart(2, "0")}.png`),
      index === 0 ? titleKey : "galleryDetailCarouselSlideAlt",
    ),
  ),
})

const translateImage = (item: GalleryImageConfig, t: Translate, altOverride?: string): GalleryImage => ({
  src: item.src,
  alt: altOverride ?? t(item.titleKey),
  title: t(item.titleKey),
  shape: item.shape,
})

const translateCarousel = (carousel: GalleryCarouselConfig, t: Translate): GalleryCarousel => {
  const title = t(carousel.titleKey)
  return {
    title,
    slides: carousel.slides.map((slide, index) =>
      translateImage(
        slide,
        t,
        index === 0
          ? `${t("galleryDetailCarouselCoverAlt")} ${title}`
          : `${t("galleryDetailCarouselSlideAlt")} ${String(index + 1).padStart(2, "0")} - ${title}`,
      ),
    ),
  }
}

export const galleryProjects: GalleryProjectConfig[] = [
  {
    nameKey: "galleryProjectFrigideiraName",
    slug: "frigideira-ai",
    year: "2026",
    typeKey: "galleryProjectFrigideiraType",
    roleKey: "galleryProjectFrigideiraRole",
    formatsKeys: ["galleryFormatPosts", "galleryFormatCarousels", "galleryFormatEditorialCovers"],
    tools: ["Photoshop", "Illustrator", "Figma", "After Effects"],
    descriptionKey: "galleryProjectFrigideiraDescription",
    heroMockup: image("/images/gallery/mockup-heros/mock-frigi.png", "galleryFrigideiraMockup"),
    caseStudy: {
      introKey: "galleryProjectFrigideiraIntro",
      challengeKey: "galleryProjectFrigideiraChallenge",
      solutionKey: "galleryProjectFrigideiraSolution",
      resultKey: "galleryProjectFrigideiraResult",
      metrics: [
        { count: "pieces", labelKey: "galleryMetricStaticPosts" },
        { count: "carousels", labelKey: "galleryMetricEditorialCarousels" },
        { count: "slides", labelKey: "galleryMetricSlides" },
      ],
    },
    visualSystem: {
      objectiveKey: "galleryVisualFrigideiraObjective",
      objectiveBodyKey: "galleryVisualFrigideiraObjectiveBody",
      fonts: [
        { name: "Garet", roleKey: "galleryVisualDisplay", family: "Garet, Montserrat, sans-serif" },
        { name: "Hagrid", roleKey: "galleryVisualBody", family: "Hagrid, Montserrat, sans-serif" },
        { name: "Bright Retro", roleKey: "galleryVisualHighlights", family: "'Bright Retro', Georgia, serif" },
      ],
      colors: [
        { hex: "#48ABCA", roleKey: "galleryVisualPrimaryColor" },
        { hex: "#2C5372", roleKey: "galleryVisualSupportColor" },
        { hex: "#D5E976", roleKey: "galleryVisualHighlights" },
        { hex: "#FFF7C5", roleKey: "galleryVisualSupportColor" },
        { hex: "#061A35", roleKey: "galleryVisualContrast" },
        { hex: "#FFFFFF", roleKey: "galleryVisualBackground" },
        { hex: "#EDF0F4", roleKey: "galleryVisualBackground" },
      ],
      objectiveMockup: image("/images/projects/frigideiraAI.png", "galleryFrigideiraMockup"),
    },
    pieces: [
      staticImage("frigideira-ai", "01.png", "galleryFrigideiraPiece01", "feature"),
      staticImage("frigideira-ai", "02.png", "galleryFrigideiraPiece02"),
      staticImage("frigideira-ai", "03.png", "galleryFrigideiraPiece03", "tall"),
      staticImage("frigideira-ai", "05.png", "galleryFrigideiraPiece05", "wide"),
    ],
    carousels: [
      carouselSlides("frigideira-ai", 1, [1, 2, 3, 4, 5, 6], "galleryFrigideiraCarousel01"),
      carouselSlides("frigideira-ai", 2, [1, 2, 3, 4, 5, 6], "galleryFrigideiraCarousel02"),
      carouselSlides("frigideira-ai", 3, [1, 2, 3, 4, 5], "galleryFrigideiraCarousel03"),
      carouselSlides("frigideira-ai", 4, [1, 2, 3, 4, 5], "galleryFrigideiraCarousel04"),
    ],
  },
  {
    nameKey: "galleryProjectTochaName",
    slug: "the-real-tocha",
    year: "2025 - 2026",
    typeKey: "galleryProjectTochaType",
    roleKey: "galleryProjectTochaRole",
    formatsKeys: ["galleryFormatPosts", "galleryFormatStories", "galleryFormatCarousels", "galleryFormatMockups"],
    tools: ["Photoshop", "Illustrator", "Figma", "CapCut"],
    descriptionKey: "galleryProjectTochaDescription",
    heroMockup: image("/images/gallery/mockup-heros/mock-trt.png", "galleryTochaMockup"),
    caseStudy: {
      introKey: "galleryProjectTochaIntro",
      challengeKey: "galleryProjectTochaChallenge",
      solutionKey: "galleryProjectTochaSolution",
      resultKey: "galleryProjectTochaResult",
      metrics: [
        { count: "carousels", labelKey: "galleryMetricCarousels" },
        { count: "pieces", labelKey: "galleryMetricStaticPosts" },
        { count: "stories", labelKey: "galleryMetricStories" },
      ],
    },
    visualSystem: {
      objectiveKey: "galleryVisualTochaObjective",
      objectiveBodyKey: "galleryVisualTochaObjectiveBody",
      fonts: [
        { name: "Antonio", roleKey: "galleryVisualDisplay", family: "Antonio, Montserrat, sans-serif" },
        { name: "Montaser Arabic", roleKey: "galleryVisualBody", family: "'Montaser Arabic', Montserrat, sans-serif" },
        { name: "Work Sans", roleKey: "galleryVisualHighlights", family: "'Work Sans', Inter, sans-serif" },
        { name: "Libre Baskerville", roleKey: "galleryVisualContrast", family: "'Libre Baskerville', Georgia, serif" },
      ],
      colors: [
        { hex: "#FFE750", roleKey: "galleryVisualPrimaryColor" },
        { hex: "#1F1F1F", roleKey: "galleryVisualSupportColor" },
        { hex: "#9A9A9A", roleKey: "galleryVisualContrast" },
        { hex: "#EDEDED", roleKey: "galleryVisualBackground" },
        { hex: "#FFF1A9", roleKey: "galleryVisualHighlights" },
        { hex: "#DA674D", roleKey: "galleryVisualSupportColor" },
        { hex: "#A4D977", roleKey: "galleryVisualSupportColor" },
      ],
      objectiveMockup: image("/images/projects/therealtochamock.png", "galleryTochaMockup"),
    },
    pieces: [
      staticImage("the-real-tocha", "04.png", "galleryTochaPiece04"),
      staticImage("the-real-tocha", "05.png", "galleryTochaPiece05", "wide"),
      staticImage("the-real-tocha", "06.png", "galleryTochaPiece06"),
      staticImage("the-real-tocha", "07.png", "galleryTochaPiece07"),
    ],
    carousels: [
      carouselSlides("the-real-tocha", 1, [1, 2, 3, 4, 5], "galleryTochaCarousel01"),
      carouselSlides("the-real-tocha", 3, [1, 2, 3, 4, 5, 6, 7], "galleryTochaCarousel03"),
      carouselSlides("the-real-tocha", 4, [1, 2, 3, 4, 5, 6], "galleryTochaCarousel04"),
      carouselSlides("the-real-tocha", 5, [1, 2, 3, 4, 5, 6, 7], "galleryTochaCarousel05"),
      carouselSlides("the-real-tocha", 6, [1, 2, 3, 4, 5, 6], "galleryTochaCarousel06"),
      carouselSlides("the-real-tocha", 7, [1, 2, 3, 4, 5, 6, 7, 8], "galleryTochaCarousel07"),
      carouselSlides("the-real-tocha", 8, [1, 2, 3, 4, 5, 6, 7], "galleryTochaCarousel08"),
      carouselSlides("the-real-tocha", 9, [1, 2, 3, 4, 5], "galleryTochaCarousel09"),
    ],
    stories: [
      storyImage("01.png", "galleryTochaStory01"),
      storyImage("02.png", "galleryTochaStory02"),
      storyImage("03.png", "galleryTochaStory03"),
      storyImage("04.png", "galleryTochaStory04"),
    ],
  },
  {
    nameKey: "galleryProjectSdpName",
    heroTitleKey: "galleryProjectSdpHeroTitle",
    slug: "sdp",
    year: "2026",
    typeKey: "galleryProjectSdpType",
    roleKey: "galleryProjectSdpRole",
    formatsKeys: ["galleryFormatCarousels", "galleryFormatCampaignPosts", "galleryFormatEditorialSequences"],
    tools: ["Photoshop", "Illustrator", "Figma"],
    descriptionKey: "galleryProjectSdpDescription",
    heroMockup: image("/images/gallery/mockup-heros/mock-sdp.png", "gallerySdpMockup"),
    caseStudy: {
      introKey: "galleryProjectSdpIntro",
      challengeKey: "galleryProjectSdpChallenge",
      solutionKey: "galleryProjectSdpSolution",
      resultKey: "galleryProjectSdpResult",
      metrics: [
        { count: "carousels", labelKey: "galleryMetricSequences" },
        { count: "slides", labelKey: "galleryMetricSlides" },
        { count: "mockup", labelKey: "galleryMetricMockups" },
      ],
    },
    visualSystem: {
      objectiveKey: "galleryVisualSdpObjective",
      objectiveBodyKey: "galleryVisualSdpObjectiveBody",
      fonts: [
        { name: "Helvetica", roleKey: "galleryVisualDisplay", family: "Helvetica, Arial, sans-serif" },
        { name: "Garet", roleKey: "galleryVisualBody", family: "Garet, Montserrat, sans-serif" },
        { name: "Playfair Display", roleKey: "galleryVisualHighlights", family: "'Playfair Display', Georgia, serif" },
      ],
      colors: [
        { hex: "#1451A7", roleKey: "galleryVisualPrimaryColor" },
        { hex: "#BFD3E2", roleKey: "galleryVisualSupportColor" },
        { hex: "#5A8BD6", roleKey: "galleryVisualSupportColor" },
        { hex: "#FFFFFF", roleKey: "galleryVisualHighlights" },
        { hex: "#303438", roleKey: "galleryVisualContrast" },
      ],
      objectiveMockup: image("/images/projects/sdpmock.png", "gallerySdpMockup"),
    },
    pieces: [],
    carousels: [
      carouselSlides("servidor-programadores", 1, [1, 2, 3], "gallerySdpCarousel01"),
      carouselSlides("servidor-programadores", 2, [1, 2, 3, 4, 5], "gallerySdpCarousel02"),
      carouselSlides("servidor-programadores", 3, [1, 2], "gallerySdpCarousel03"),
      carouselSlides("servidor-programadores", 4, [1, 2, 3], "gallerySdpCarousel04"),
      carouselSlides("servidor-programadores", 5, [1, 2], "gallerySdpCarousel05"),
    ],
  },
]

export const getGalleryProjectConfigBySlug = (slug: string) => galleryProjects.find((project) => project.slug === slug)

const countProjectMetric = (project: GalleryProjectConfig, count: GalleryMetricConfig["count"]) => {
  if (count === "pieces") return project.pieces.length
  if (count === "carousels") return project.carousels?.length ?? 0
  if (count === "stories") return project.stories?.length ?? 0
  if (count === "mockup") return project.heroMockup.src ? 1 : 0
  return project.carousels?.reduce((total, carousel) => total + carousel.slides.length, 0) ?? 0
}

export const getTranslatedGalleryProject = (project: GalleryProjectConfig, t: Translate): GalleryProject => ({
  name: t(project.nameKey),
  heroTitle: project.heroTitleKey ? t(project.heroTitleKey) : undefined,
  slug: project.slug,
  year: project.year,
  type: t(project.typeKey),
  role: t(project.roleKey),
  formats: project.formatsKeys.map(t),
  tools: project.tools,
  description: t(project.descriptionKey),
  heroMockup: translateImage(project.heroMockup, t),
  caseStudy: {
    intro: t(project.caseStudy.introKey),
    challenge: t(project.caseStudy.challengeKey),
    solution: t(project.caseStudy.solutionKey),
    result: t(project.caseStudy.resultKey),
    metrics: project.caseStudy.metrics.map((metric) => ({
      value: String(countProjectMetric(project, metric.count)).padStart(2, "0"),
      label: t(metric.labelKey),
    })),
  },
  visualSystem: {
    objective: t(project.visualSystem.objectiveKey),
    objectiveBody: t(project.visualSystem.objectiveBodyKey),
    fonts: project.visualSystem.fonts.map((font) => ({ name: font.name, role: t(font.roleKey), family: font.family })),
    colors: project.visualSystem.colors.map((color) => ({ hex: color.hex, role: t(color.roleKey) })),
    objectiveMockup: translateImage(project.visualSystem.objectiveMockup, t),
  },
  pieces: project.pieces.map((item) => translateImage(item, t)),
  carousels: project.carousels?.map((carousel) => translateCarousel(carousel, t)),
  stories: project.stories?.map((item) => translateImage(item, t)),
})

export const getTranslatedGalleryProjects = (t: Translate) => galleryProjects.map((project) => getTranslatedGalleryProject(project, t))

export const getNextGalleryProject = (slug: string, t: Translate) => {
  const index = galleryProjects.findIndex((project) => project.slug === slug)
  const project = galleryProjects[index === -1 ? 0 : (index + 1) % galleryProjects.length]
  return getTranslatedGalleryProject(project, t)
}

const playgroundPieces: GalleryImageConfig[] = [
  staticImage("playground", "01.png", "galleryPlaygroundPiece01", "feature"),
  staticImage("playground", "02.png", "galleryPlaygroundPiece02"),
  staticImage("playground", "03.png", "galleryPlaygroundPiece03", "tall"),
  staticImage("playground", "04.png", "galleryPlaygroundPiece04"),
  staticImage("playground", "05.png", "galleryPlaygroundPiece05", "wide"),
  staticImage("playground", "6-save-our-seas-logo.png", "galleryPlaygroundPiece08"),
  staticImage("playground", "06-save-our-seas.png", "galleryPlaygroundPiece06", "feature"),
  staticImage("playground", "07.png", "galleryPlaygroundPiece07"),
]

export const getTranslatedPlaygroundPieces = (t: Translate) => playgroundPieces.map((item) => translateImage(item, t))
