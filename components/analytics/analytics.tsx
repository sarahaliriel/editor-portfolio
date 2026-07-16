"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const CONSENT_STORAGE_KEY = "portfolio:analytics-consent"
export const ANALYTICS_CONSENT_EVENT = "analytics:consent"

type ConsentState = "granted" | "denied"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

const rawGoogleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const rawClarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim()

const googleAnalyticsId = rawGoogleAnalyticsId && /^G-[A-Z0-9]+$/i.test(rawGoogleAnalyticsId)
  ? rawGoogleAnalyticsId
  : undefined

const clarityProjectId = rawClarityProjectId && /^[a-z0-9]+$/i.test(rawClarityProjectId)
  ? rawClarityProjectId
  : undefined

export function setAnalyticsConsent(granted: boolean) {
  const state: ConsentState = granted ? "granted" : "denied"
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state)
  } catch {
    // Consent is still applied for the current page when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(ANALYTICS_CONSENT_EVENT, { detail: state }))
}

function applyConsent(state: ConsentState) {
  window.gtag?.("consent", "update", {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })

  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: state,
  })

  if (state === "denied") window.clarity?.("consent", false)
}

export default function Analytics() {
  const pathname = usePathname()
  const initialPathRef = useRef(pathname)

  useEffect(() => {
    const onConsent = (event: Event) => {
      const state = (event as CustomEvent<ConsentState>).detail
      applyConsent(state === "granted" ? "granted" : "denied")
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent)
  }, [])

  useEffect(() => {
    if (!googleAnalyticsId || pathname === initialPathRef.current) return

    window.gtag?.("config", googleAnalyticsId, {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  if (!googleAnalyticsId && !clarityProjectId) return null

  const consentBootstrap = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
    var analyticsConsent = "denied";
    try {
      analyticsConsent = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) === "granted" ? "granted" : "denied";
    } catch (error) {}
    window.gtag("consent", "default", {
      analytics_storage: analyticsConsent,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500
    });
  `

  const googleAnalyticsBootstrap = googleAnalyticsId ? `
    window.gtag("js", new Date());
    window.gtag("config", ${JSON.stringify(googleAnalyticsId)}, {
      anonymize_ip: true
    });
  ` : ""

  const clarityBootstrap = clarityProjectId ? `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: analyticsConsent
    });
  ` : ""

  return (
    <>
      <script
        id="analytics-consent-default"
        dangerouslySetInnerHTML={{ __html: consentBootstrap }}
      />

      {googleAnalyticsId ? (
        <>
          <Script
            id="google-analytics-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {googleAnalyticsBootstrap}
          </Script>
        </>
      ) : null}

      {clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {clarityBootstrap}
        </Script>
      ) : null}
    </>
  )
}
