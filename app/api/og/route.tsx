import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "";
  const description =
    searchParams.get("description") ??
    "Premium Hospitality & Commercial Kitchen Equipment";

  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

  // Fetch PNG icon as base64 (PNG is reliably supported by Satori)
  let iconSrc = `${siteOrigin}/loco_icon.png`;
  try {
    const res = await fetch(`${siteOrigin}/loco_icon.png`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      iconSrc = `data:image/png;base64,${btoa(binary)}`;
    }
  } catch {
    // keep URL fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Red top bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#dc2626",
            display: "flex",
            flexShrink: 0,
          }}
        />

        {/* Main content — explicit height so bottom bar stays fixed */}
        <div
          style={{
            width: "100%",
            height: "550px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 100px",
          }}
        >
          {/* Logo card */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "18px",
              padding: "20px 36px",
              marginBottom: "36px",
            }}
          >
            {/* White box behind icon so dark icon is visible */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                width: "68px",
                height: "68px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconSrc}
                width={52}
                height={52}
                alt=""
                style={{ display: "block" }}
              />
            </div>

            {/* Wordmark */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "40px",
                  fontWeight: "800",
                  display: "flex",
                  lineHeight: "1",
                }}
              >
                HorecaHost
              </div>
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  lineHeight: "1",
                }}
              >
                horecahost.com
              </div>
            </div>
          </div>

          {/* Page title */}
          {title.length > 0 && (
            <div
              style={{
                color: "#ffffff",
                fontSize: "52px",
                fontWeight: "800",
                display: "flex",
                lineHeight: "1.2",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {title}
            </div>
          )}

          {/* Description */}
          <div
            style={{
              color: "#94a3b8",
              fontSize: title.length > 0 ? "24px" : "30px",
              display: "flex",
              lineHeight: "1.5",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom bar — fixed 72px */}
        <div
          style={{
            width: "100%",
            height: "72px",
            flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px",
          }}
        >
          <div
            style={{ color: "#475569", fontSize: "18px", display: "flex" }}
          >
            📍 Al Garhoud, Dubai, UAE
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#dc2626",
                display: "flex",
              }}
            />
            <div
              style={{
                color: "#cbd5e1",
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
              }}
            >
              Premium Hospitality Equipment Supplier
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
