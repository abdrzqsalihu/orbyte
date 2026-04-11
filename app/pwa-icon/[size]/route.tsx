import { ImageResponse } from "next/og";

const validSizes = new Set([180, 192, 512]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeParam } = await params;
  const size = Number(sizeParam);

  if (!validSizes.has(size)) {
    return new Response("Not found", { status: 404 });
  }

  const accentSize = Math.round(size * 0.68);
  const iconSize = Math.round(size * 0.34);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #1a1433 0%, #0a0616 55%, #04010b 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: accentSize,
            height: accentSize,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.22),
            background: "#090611",
            border: `${Math.max(2, Math.round(size * 0.02))}px solid #7c5cff`,
            boxShadow: `0 ${Math.round(size * 0.06)}px ${Math.round(
              size * 0.15,
            )}px rgba(124, 92, 255, 0.35)`,
          }}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              display: "flex",
              overflow: "visible",
            }}
          >
            <polygon
              points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
              fill="rgba(124, 92, 255, 0.14)"
              stroke="#7c5cff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
