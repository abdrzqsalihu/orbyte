import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider } from "@/hooks/use-theme";
import "./globals.css";

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
      <body suppressHydrationWarning>
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
