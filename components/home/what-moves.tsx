"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import type { MotionValue } from "framer-motion"
import { useRef } from "react"
import { useI18n } from "@/components/providers/i18n"

const moveKeywords = /^(pararem|sentirem|lembrarem|stop|feel|remember|detengan|sientan|recuerden)[,.]?$/i

function MovingWord({
  children,
  index,
  total,
  progress,
  emphasized,
  reducedMotion,
}: {
  children: string
  index: number
  total: number
  progress: MotionValue<number>
  emphasized: boolean
  reducedMotion: boolean
}) {
  const start = 0.08 + (index / total) * 0.7
  const end = Math.min(start + (emphasized ? 0.2 : 0.14), 0.96)
  const opacity = useTransform(progress, [start, end], reducedMotion ? [1, 1] : [emphasized ? 0.06 : 0.18, 1])
  const y = useTransform(progress, [start, end], reducedMotion ? [0, 0] : [emphasized ? 34 : 22, 0])
  const filter = useTransform(
    progress,
    [start, end],
    reducedMotion ? ["blur(0px)", "blur(0px)"] : [emphasized ? "blur(9px)" : "blur(6px)", "blur(0px)"]
  )

  return (
    <motion.span
      className={emphasized ? "inline-block font-black text-[#1800ad]" : "inline-block"}
      style={{ opacity, y, filter }}
    >
      {children}
    </motion.span>
  )
}

export default function WhatMoves() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const quote = t("moreAboutMovesQuote")
  const words = quote.split(/\s+/)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  return (
    <section
      ref={sectionRef}
      className={
        prefersReducedMotion
          ? "relative bg-[#e8e7e7] px-4 py-28 text-[#1e1e1e] sm:px-8 sm:py-36 lg:px-12"
          : "relative h-[260svh] bg-[#e8e7e7] px-4 text-[#1e1e1e] sm:px-8 lg:px-12"
      }
    >
      <div className={prefersReducedMotion ? "mx-auto w-full max-w-370" : "sticky top-0 mx-auto flex h-svh w-full max-w-370 items-center"}>
        <div className="w-full py-16 sm:py-20">
          <motion.span
            className="kicker block text-[#1800ad]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("moreAboutMovesKicker")}
          </motion.span>

          <p
            className="mt-12 max-w-[14ch] font-display text-[clamp(3.2rem,8.8vw,9.5rem)] font-semibold leading-[0.94] tracking-[-0.045em] sm:mt-16"
            aria-label={quote}
          >
            {words.map((word, index) => {
              const emphasized = moveKeywords.test(word)

              return (
                <span key={`${word}-${index}`} aria-hidden="true">
                  <MovingWord
                    index={index}
                    total={words.length}
                    progress={scrollYProgress}
                    emphasized={emphasized}
                    reducedMotion={Boolean(prefersReducedMotion)}
                  >
                    {word}
                  </MovingWord>
                  {index < words.length - 1 ? " " : null}
                </span>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
