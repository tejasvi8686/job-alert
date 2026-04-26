import { ImageResponse } from "next/og";

export const alt = "JobAlert launch preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#FDFBF7",
          color: "#1D1B18",
          padding: "56px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 24,
              color: "#B8503A",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            JobAlert · Public Beta
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: "980px",
            }}
          >
            Daily AI-matched jobs for developers
          </div>
          <div style={{ fontSize: 30, color: "#7A746C", maxWidth: "900px" }}>
            Set your role once. Get a focused digest every morning.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#7A746C",
          }}
        >
          <span>jobalert · launch cycle</span>
          <span style={{ color: "#4A7A62" }}>Built in public</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
