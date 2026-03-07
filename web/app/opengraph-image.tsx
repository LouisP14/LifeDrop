import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LifeDrop — Suivi de don du sang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(248, 113, 113, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(248, 113, 113, 0.06)",
          }}
        />

        {/* Blood drop icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(248, 113, 113, 0.15)",
            marginBottom: 24,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              fill="#f87171"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 800, color: "#ffffff" }}>
            life
          </span>
          <span style={{ fontSize: 56, fontWeight: 800, color: "#f87171" }}>
            drop
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Suivez vos dons de sang, vérifiez votre éligibilité et mesurez votre impact.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 32,
            padding: "16px 32px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#f87171" }}>3</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>vies sauvées / don</span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fb923c" }}>10 000</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>dons nécessaires / jour</span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#60a5fa" }}>100%</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>gratuit</span>
          </div>
        </div>

        {/* URL */}
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", marginTop: 24 }}>
          lifedrop.fr
        </p>
      </div>
    ),
    { ...size },
  );
}
