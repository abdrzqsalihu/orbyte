"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useNextTheme();
  const [accentColor, setAccentColorState] = useState<string>("purple");
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  // Load accent color from Supabase or localStorage on mount
  useEffect(() => {
    setMounted(true);

    const loadAccentColor = async () => {
      // First try to get from user's profile in Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("accent_color")
          .eq("id", user.id)
          .single();

        if (profile?.accent_color) {
          setAccentColorState(profile.accent_color);
          // Also save to localStorage as cache
          localStorage.setItem("accent-color", profile.accent_color);
          return;
        }
      }

      // Fallback to localStorage if not logged in or no profile
      const savedAccentColor = localStorage.getItem("accent-color");
      if (savedAccentColor) {
        setAccentColorState(savedAccentColor);
      }
    };

    loadAccentColor();
  }, []);

  // Wrapper to save to both localStorage and Supabase when accent color changes
  const setAccentColor = async (color: string) => {
    setAccentColorState(color);
    localStorage.setItem("accent-color", color);

    // Save to Supabase if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_profiles").upsert({
        id: user.id,
        accent_color: color,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Apply accent color
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

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
    };

    const color =
      accentColors[accentColor as keyof typeof accentColors] ||
      accentColors.purple;

    // Set CSS variables
    root.style.setProperty(
      "--accent",
      `${color.hue} ${color.saturation} ${color.lightness}`,
    );
    root.style.setProperty(
      "--primary",
      `${color.hue} ${color.saturation} ${color.lightness}`,
    );
    root.style.setProperty(
      "--ring",
      `${color.hue} ${color.saturation} ${color.lightness}`,
    );
  }, [accentColor, mounted]);

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
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
