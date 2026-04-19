import type React from "react";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { PwaProvider } from "@/components/pwa-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider as AppThemeProvider } from "@/hooks/use-theme";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const barlow = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400"],
});


export const metadata: Metadata = {
  title: "Orbyte | Modern Task Management",
  description:
    "Streamline work processes, enhance productivity, and improve team collaboration",
  applicationName: "Orbyte",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Orbyte",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa-icon/180", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c5cff",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${barlow.className} antialiased`}
      >
        <Analytics />
        <PwaProvider />
        <Toaster position="top-right" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppThemeProvider>{children}</AppThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
