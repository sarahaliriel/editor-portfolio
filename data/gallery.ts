export type GalleryShot = {
  src: string
  alt: string
  w: number
  h: number
}

export const galleryShots: GalleryShot[] = Array.from({ length: 38 }, (_, index) => ({
  src: `/images/gallery/post-${String(index + 1).padStart(2, "0")}.png`,
  alt: `Post ${index + 1}`,
  w: 1080,
  h: 1080,
}))
