import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Orbyte",
    short_name: "Orbyte",
    description:
      "Streamline work processes, enhance productivity, and improve team collaboration",
    id: "/dashboard",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050816",
    theme_color: "#7c5cff",
    icons: [
      {
        src: "/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Open your Orbyte dashboard",
        url: "/dashboard",
      },
      {
        name: "Kanban Board",
        short_name: "Kanban",
        description: "Jump into the kanban workflow",
        url: "/dashboard/kanban",
      },
      {
        name: "Calendar",
        short_name: "Calendar",
        description: "Review scheduled work",
        url: "/dashboard/calendar",
      },
    ],
  };
}
