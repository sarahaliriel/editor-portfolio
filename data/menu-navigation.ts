import type { I18nKey } from "@/components/providers/i18n"

export type MenuNavigationItem = {
  id: string
  number: string
  labelKey: I18nKey
  descriptionKey: I18nKey
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
  },
  {
    id: "about",
    number: "02",
    labelKey: "menuAboutLabel",
    descriptionKey: "menuAboutDescription",
    navigation: "route",
    href: "/more-about",
  },
  {
    id: "design-gallery",
    number: "03",
    labelKey: "menuDesignLabel",
    descriptionKey: "menuDesignDescription",
    navigation: "route",
    href: "/gallery",
  },
  {
    id: "motion-archive",
    number: "04",
    labelKey: "menuMotionLabel",
    descriptionKey: "menuMotionDescription",
    navigation: "route",
    href: "/allprojects",
  },
  {
    id: "contact",
    number: "05",
    labelKey: "menuContactLabel",
    descriptionKey: "menuContactDescription",
    navigation: "contact",
    href: "/#contact",
  },
] as const
