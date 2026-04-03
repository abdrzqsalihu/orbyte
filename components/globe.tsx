"use client";
import dynamic from "next/dynamic";
import { Activity, CheckSquare, Users } from "lucide-react";
const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function Globe() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const sampleArcs = [
    { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: colors[0] },
    { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: colors[1] },
    { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: colors[2] },
    { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[0] },
    { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: colors[1] },
    { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: colors[2] },
  ];

  return (
    <div className="relative w-full mx-auto flex items-center justify-center p-3 sm:p-4 md:p-8">
      <div className="relative w-full max-w-[500px] aspect-square">
        <div className="absolute inset-4 border border-border/30 bg-muted/5 z-0" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-border/40 -translate-x-1/2 z-0" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-border/40 -translate-y-1/2 z-0" />

        <div className="absolute inset-8 rounded-full border border-border/20 border-dashed z-0 animate-[spin_120s_linear_infinite]" />
        <div className="absolute inset-16 rounded-full border border-border/40 z-0" />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-8 md:left-8 z-20 flex items-center gap-1 sm:gap-2 bg-background border border-border px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <Activity className="h-2 w-2 sm:h-3 sm:w-3 text-primary animate-pulse flex-shrink-0" />
          <span className="hidden sm:inline">Live Workspace</span>
          <span className="sm:hidden">Live</span>
        </div>

        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-20 flex flex-col items-end gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-wider text-right">
          <div className="bg-background border border-border px-1 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500"></span>
            <span className="hidden sm:inline">Teams Synced</span>
            <span className="sm:hidden">Teams</span>
          </div>
          <div className="bg-background border border-border px-1 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 sm:gap-2">
            <CheckSquare className="h-2 w-2 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
            <span className="hidden sm:inline">Active Tasks: 1,204</span>
            <span className="sm:hidden">1,204</span>
          </div>
        </div>

        <div className="absolute top-1/4 right-0 translate-x-1/2 bg-background border border-border p-1 sm:p-1.5 text-primary z-20 hidden md:block">
          <Users className="h-3 w-3" />
        </div>

        <div className="absolute inset-8 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full relative">
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>
        </div>

        {/* Corner bracket accents */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-2 h-2 sm:w-4 sm:h-4 border-t-2 border-l-2 border-primary/50" />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-4 sm:h-4 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-2 h-2 sm:w-4 sm:h-4 border-b-2 border-l-2 border-primary/50" />
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-2 h-2 sm:w-4 sm:h-4 border-b-2 border-r-2 border-primary/50" />

      </div>
    </div>
  );
}