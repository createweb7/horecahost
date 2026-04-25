import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const description =
    searchParams.get("description") ||
    "Premium Hospitality & Commercial Kitchen Equipment";

  // Read logo from public folder and encode as base64
  const logoPath = path.join(process.cwd(), "public/horecahost_logo.webp");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/webp;base64,${logoData.toString("base64")}`;

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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(220,38,38,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Dot grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Logo card */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "24px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: title ? "36px" : "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            width={340}
            height={87}
            alt="HorecaHost"
            style={{ objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Page title (optional) */}
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

        {/* Description / tagline */}
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
              alignItems: "center",
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
