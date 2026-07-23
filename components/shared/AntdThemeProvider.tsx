"use client";

import { App, ConfigProvider, theme } from "antd";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";

export function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDark = useIsDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#2a78d6" },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
