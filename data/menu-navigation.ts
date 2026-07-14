import type { I18nKey } from "@/components/providers/i18n"

export type MenuPreviewType = "home" | "about" | "design" | "motion" | "contact"

export type MenuNavigationItem = {
  id: string
  number: string
  labelKey: I18nKey
  descriptionKey: I18nKey
  previewType: MenuPreviewType
} & (
  | { navigation: "route"; href: string }
  | { navigation: "contact"; href: "/#contact" }
)

export const MENU_NAVIGATION_ITEMS: readonly MenuNavigationItem[] = [
  {
    id: "home",
    number: "01",
    labelKey: "menuHomeLabel",
    descriptionKey: "menuHomeDescription",
    navigation: "route",
    href: "/",
    previewType: "home",
  },
  {
    id: "about",
    number: "02",
    labelKey: "menuAboutLabel",
    descriptionKey: "menuAboutDescription",
    navigation: "route",
    href: "/more-about",
    previewType: "about",
  },
  {
    id: "design-gallery",
    number: "03",
    labelKey: "menuDesignLabel",
    descriptionKey: "menuDesignDescription",
    navigation: "route",
    href: "/gallery",
    previewType: "design",
  },
  {
    id: "motion-archive",
    number: "04",
    labelKey: "menuMotionLabel",
    descriptionKey: "menuMotionDescription",
    navigation: "route",
    href: "/allprojects",
    previewType: "motion",
  },
  {
    id: "contact",
    number: "05",
    labelKey: "menuContactLabel",
    descriptionKey: "menuContactDescription",
    navigation: "contact",
    href: "/#contact",
    previewType: "contact",
  },
] as const
