import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const description =
    searchParams.get("description") ||
    "Premium Hospitality & Commercial Kitchen Equipment";

  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

  // Fetch logo and convert to base64 (Edge runtime doesn't have fs)
  let logoSrc = `${siteOrigin}/horecahost_logo.webp`;
  try {
    const res = await fetch(`${siteOrigin}/horecahost_logo.webp`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      logoSrc = `data:image/webp;base64,${btoa(binary)}`;
    }
  } catch {
    // fallback to URL if fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top red accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#dc2626",
            display: "flex",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "350px",
            background:
              "radial-gradient(ellipse, rgba(220,38,38,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Logo on white card */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: "20px",
            padding: "24px 52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: title ? "40px" : "28px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={340}
            height={87}
            alt="HorecaHost"
            style={{ objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Page title */}
        {title && (
          <div
            style={{
              color: "#ffffff",
              fontSize: "52px",
              fontWeight: "800",
              textAlign: "center",
              maxWidth: "900px",
              lineHeight: "1.15",
              letterSpacing: "-1px",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {title}
          </div>
        )}

        {/* Description */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: title ? "26px" : "32px",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
            display: "flex",
          }}
        >
          {description}
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "72px",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "20px",
              display: "flex",
              gap: "8px",
            }}
          >
            📍 Al Garhoud, Dubai, UAE
          </div>
          <div
            style={{
              color: "#dc2626",
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              display: "flex",
            }}
          >
            horecahost.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
