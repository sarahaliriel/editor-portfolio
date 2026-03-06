"use client"

import { useMemo } from "react"
import { useI18n } from "@/components/i18n"

type NavItem = { label: string; href: string }
type SocialItem = { label: string; href: string }

export default function Footer() {
  const { t } = useI18n()

  const socials = useMemo<SocialItem[]>(
    () => [
      { label: "Instagram", href: "https://www.instagram.com/chazinhodociel/" },
      { label: "TikTok", href: "https://www.tiktok.com/@cielstea" },
      { label: "Linkedin", href: "https://www.linkedin.com/in/sarahaliriel/" },
      { label: "Discord", href: "https://discord.com/users/942126894478950530" },
    ],
    []
  )

  const onContact = () => {
    window.history.replaceState(null, "", "#contact")
    window.dispatchEvent(new CustomEvent("nav:contact"))
  }

  const year = new Date().getFullYear()
  const headline = t("footerHeadline").split("\n")

  return (
    <footer className="relative w-full overflow-hidden bg-[#e8e7e7] text-[#1e1e1e]" aria-label={t("footerAria")}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 -top-44 h-130 w-130 rounded-full bg-[#1800ad]/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-52 h-155 w-155 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="relative container-bleed py-16 sm:py-18 lg:py-22">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h3 className="mt-5 font-display text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[0.98] tracking-tight">
              {headline[0]}
              <br />
              {headline[1]}
            </h3>

            <p className="mt-5 max-w-[62ch] text-[14px] leading-[1.6] text-black/70 sm:text-[15px]">{t("footerBody")}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onContact}
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/20 bg-black/5 px-6 text-[14px] tracking-wide transition-all duration-300 hover:bg-black/8 hover:border-black/30 active:scale-[0.99]"
              >
                {t("footerCtaTalk")}
              </button>

              <a
                href="mailto:dumitrachefilha@gmail.com"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 px-6 text-[14px] tracking-wide text-black/75 transition-all duration-300 hover:border-black/25 hover:text-black"
              >
                dumitrachefilha@gmail.com
              </a>
            </div>

            <div className="mt-10 w-full rounded-[28px] border border-black/10 bg-white/45 p-6 transition-all duration-300 hover:bg-white/55 hover:border-black/15 lg:max-w-[62ch]">
  <div className="pl-7.5 text-[12px] tracking-[0.22em] uppercase text-black/60">{t("footerFindMe")}</div>

  <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-[14px] text-black/75">
    {socials.map((s) => (
      <a
        key={s.label}
        href={s.href}
        target={s.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
        className="group relative inline-flex items-center gap-3 rounded-full px-2 py-1 transition-all duration-300 hover:bg-black/5 hover:text-black"
      >
        <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
          <span className="ping-dot opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </span>

        <span className="underline decoration-black/0 underline-offset-4 transition-all group-hover:decoration-black/25">
          {s.label}
        </span>
      </a>
    ))}
  </div>
</div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-black/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[13px] text-black/60">
            © {year} Sarah Aliriel Dumitrache. {t("footerRights")}
          </div>
          <div className="text-[13px] text-black/60">{t("footerMade")}</div>
        </div>
      </div>
    </footer>
  )
}