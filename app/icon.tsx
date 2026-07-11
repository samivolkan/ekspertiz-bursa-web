import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#f5f2e9",
          color: "#161a1b",
          fontFamily: "Arial, sans-serif",
          fontSize: 23,
          fontWeight: 900,
          letterSpacing: -2,
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>EB</span>
        <span
          style={{
            position: "absolute",
            top: 31,
            left: 8,
            width: 29,
            height: 8,
            background: "#ffb200",
            transform: "skewX(-32deg)",
          }}
        />
      </div>
    ),
    size,
  );
}
