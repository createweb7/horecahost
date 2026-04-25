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

  // Fetch PNG icon (Satori supports PNG reliably)
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
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 80px",
            gap: "0px",
          }}
        >
          {/* Logo row: icon + wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "20px 40px",
              marginBottom: title ? "44px" : "32px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              width={64}
              height={64}
              alt=""
              style={{ display: "block", borderRadius: "10px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "42px",
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
          {title && (
            <div
              style={{
                color: "#ffffff",
                fontSize: "54px",
                fontWeight: "800",
                textAlign: "center",
                display: "flex",
                lineHeight: "1.15",
                marginBottom: "20px",
                maxWidth: "900px",
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
              display: "flex",
              lineHeight: "1.5",
              maxWidth: "860px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            width: "100%",
            height: "72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.03)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "19px",
              display: "flex",
            }}
          >
            📍 Al Garhoud, Dubai, UAE
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
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
                color: "#e2e8f0",
                fontSize: "19px",
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
    {
      width: 1200,
      height: 630,
    }
  );
}
