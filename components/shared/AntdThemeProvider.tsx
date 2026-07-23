"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { App, ConfigProvider, theme as antTheme } from "antd";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within AntdThemeProvider");
  return ctx;
}

export function AntdThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          token: {
            colorPrimary: theme === "dark" ? "#ffffff" : "#000000",
            colorTextLightSolid: theme === "dark" ? "#000000" : "#ffffff",
            colorText: theme === "dark" ? "#f5f4ee" : "#111111",
            colorBgElevated: theme === "dark" ? "#1f1f1f" : "#ffffff",
            borderRadius: 16,
            fontFamily: "var(--font-geist-sans)",
          },
          components: {
            Card: {
              colorBorderSecondary: theme === "dark" ? "#222" : "transparent",
              boxShadowTertiary:
                theme === "dark"
                  ? "0 4px 20px rgba(0,0,0,0.5)"
                  : "0 10px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
              colorBgContainer: theme === "dark" ? "#141414" : "#ffffff",
            },
            Button: {
              controlHeight: 40,
              controlHeightLG: 48,
              borderRadius: 12,
            },
            Input: {
              controlHeight: 40,
              borderRadius: 12,
            },
            Select: {
              controlHeight: 40,
              borderRadius: 12,
              optionSelectedBg: theme === "dark" ? "#2a2a2a" : "#f0f0ee",
              optionSelectedColor: theme === "dark" ? "#f5f4ee" : "#111111",
              optionActiveBg: theme === "dark" ? "#232323" : "#f5f5f3",
              controlItemBgActiveHover: theme === "dark" ? "#2a2a2a" : "#f0f0ee",
              colorTextPlaceholder: theme === "dark" ? "#8c8c8c" : "#8c8c86",
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
