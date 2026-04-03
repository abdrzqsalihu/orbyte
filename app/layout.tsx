import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider } from "@/hooks/use-theme";
import "./globals.css";
import { Toaster } from "sonner";

const barlow = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400"],
});


export const metadata: Metadata = {
  title: "Orbyte | Modern Task Management",
  description:
    "Streamline work processes, enhance productivity, and improve team collaboration",
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
        <Toaster position="top-right" />
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
