"use client"

import { useMemo, useState } from "react"
import { useI18n } from "@/components/providers/i18n"

type Status = "idle" | "sending" | "success" | "error"

export default function Contact({ id = "contact" }: { id?: string }) {
  const { t } = useI18n()

  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")

  const ready = useMemo(() => {
    const okName = name.trim().length >= 2
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    const okMsg = message.trim().length >= 10
    return okName && okEmail && okMsg
  }, [name, email, message])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready || status === "sending") return

    setStatus("sending")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      })

      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t("contactErrSend"))
      }

      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : t("contactErrGeneric"))
      window.setTimeout(() => setStatus("idle"), 1100)
    }
  }

  return (
    <section id={id} className="relative w-full bg-[#1e1e1e] text-[#e8e7e7] overflow-hidden">
      <span
        aria-hidden="true"
        data-orb-anchor="cta"
        className="pointer-events-none absolute right-6 bottom-7 h-28 w-28 rounded-full sm:bottom-auto sm:right-[8vw] sm:top-[58%] sm:h-36.25 sm:w-36.25 lg:right-[10vw] lg:h-42.5 lg:w-42.5"
      />
      <div className="container-bleed max-h-svh overflow-y-auto py-12 sm:py-14">
        {status !== "success" ? (
          <>
            <div className="max-w-4xl">
              <span className="kicker text-[rgba(232,231,231,.65)]">{t("contactKicker")}</span>

              <h2 className="font-display font-extrabold tracking-tight whitespace-nowrap text-[clamp(2.6rem,9vw,9.5rem)] leading-[0.85] mt-4">
                {t("contactTitle")}
              </h2>

              <p className="mt-4 max-w-xl text-[rgba(232,231,231,.75)] text-[15px] sm:text-base">{t("contactBody")}</p>

              {status === "error" && errorMsg ? (
                <p className="mt-4 text-[13px] text-[rgba(232,231,231,.72)]">{errorMsg}</p>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="mt-10 max-w-3xl space-y-7">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-[rgba(232,231,231,.35)] py-3.5 text-[17px] outline-none focus:border-[#1800ad] transition-colors"
                  placeholder={t("contactNamePh")}
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[rgba(232,231,231,.35)] py-3.5 text-[17px] outline-none focus:border-[#1800ad] transition-colors"
                  placeholder={t("contactEmailPh")}
                />
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border-b border-[rgba(232,231,231,.35)] py-3.5 text-[17px] outline-none resize-none focus:border-[#1800ad] transition-colors scrollbar-sarah"
                  placeholder={t("contactMsgPh")}
                />
              </div>

              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!ready || status === "sending"}
                  className="group inline-flex items-center gap-6 text-[17px] font-medium disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="relative inline-flex items-center">
                    <span className="relative">
                      {status === "sending" ? t("contactSending") : t("contactSend")}
                      <span className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#1800ad] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"></span>
                      <span className="ping-dot"></span>
                    </span>
                  </span>

                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,231,231,.4)] transition-all duration-350 ease-[cubic-bezier(.16,1,.3,1)] group-hover:border-[#1800ad] group-hover:bg-[#1800ad]/12 group-hover:scale-110">
                    <span className="transition-transform duration-350 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0.5">→</span>
                    <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-350 group-hover:opacity-100 ring-1 ring-[#1800ad]/35"></span>
                  </span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="max-w-5xl">
            <span className="kicker text-[rgba(232,231,231,.65)]">{t("contactOkKicker")}</span>

            <h2 className="font-display mt-6 text-[clamp(2.4rem,5.6vw,5.2rem)] leading-[0.95] tracking-[-0.04em]">
              {t("contactOkTitle")}
            </h2>

            <p className="mt-6 max-w-2xl text-[rgba(232,231,231,.75)] text-base md:text-lg">{t("contactOkBody")}</p>

            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-10 group inline-flex items-center gap-6 text-lg font-medium"
            >
              <span className="relative">
                {t("contactSendAnother")}
                <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 bg-[#1800ad] transition-transform duration-350 group-hover:scale-x-100 origin-left"></span>
              </span>

              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,231,231,.4)] transition-all duration-300 group-hover:border-[#1800ad] group-hover:bg-[#1800ad]/12 group-hover:scale-110">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
