import { NextRequest } from "next/server"

function resolveVideoUrl(src: string) {
  const clean = src.trim()
  const resourceKey = clean.match(/[?&]resourcekey=([^&]+)/)?.[1]
  const suffix = resourceKey ? `&resourcekey=${resourceKey}` : ""

  const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch?.[1]) {
    return `https://drive.usercontent.google.com/download?id=${driveMatch[1]}&export=download${suffix}`
  }

  const openMatch = clean.match(/[?&]id=([^&]+)/)
  if (clean.includes("drive.google.com/open") && openMatch?.[1]) {
    return `https://drive.usercontent.google.com/download?id=${openMatch[1]}&export=download${suffix}`
  }

  return clean
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src")
  if (!src) {
    return new Response("Missing video source", { status: 400 })
  }

  const target = resolveVideoUrl(src)
  let url: URL

  try {
    url = new URL(target)
  } catch {
    return new Response("Invalid video source", { status: 400 })
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return new Response("Unsupported video source", { status: 400 })
  }

  const range = request.headers.get("range")
  const upstream = await fetch(url, {
    headers: range ? { Range: range } : undefined,
    redirect: "follow",
  })

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Video source unavailable", { status: upstream.status })
  }

  const headers = new Headers()
  const passthrough = ["content-type", "content-length", "content-range", "accept-ranges"]

  for (const key of passthrough) {
    const value = upstream.headers.get(key)
    if (value) headers.set(key, value)
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "video/mp4")
  }

  headers.set("accept-ranges", "bytes")
  headers.set("cache-control", "public, max-age=3600")

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  })
}
