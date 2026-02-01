"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
  toggleTheme: () => void
  accentColor: string
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useNextTheme()
  const [accentColor, setAccentColor] = useState<string>("purple")
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Apply accent color
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Define accent color values
    const accentColors = {
      purple: {
        hue: "252",
        saturation: "87%",
        lightness: "67%",
      },
      blue: {
        hue: "217",
        saturation: "91%",
        lightness: "60%",
      },
      cyan: {
        hue: "190",
        saturation: "95%",
        lightness: "39%",
      },
      pink: {
        hue: "330",
        saturation: "95%",
        lightness: "60%",
      },
      green: {
        hue: "142",
        saturation: "71%",
        lightness: "45%",
      },
    }

    const color = accentColors[accentColor as keyof typeof accentColors] || accentColors.purple

    // Set CSS variables
    root.style.setProperty("--accent", `${color.hue} ${color.saturation} ${color.lightness}`)
    root.style.setProperty("--primary", `${color.hue} ${color.saturation} ${color.lightness}`)
    root.style.setProperty("--ring", `${color.hue} ${color.saturation} ${color.lightness}`)
  }, [accentColor, mounted])

  return (
    <ThemeContext.Provider
      value={{
        theme: mounted ? theme || "dark" : "dark",
        setTheme,
        toggleTheme,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
