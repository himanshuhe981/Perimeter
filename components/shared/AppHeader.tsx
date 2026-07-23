"use client";

import { Avatar } from "antd";
import { Logo } from "@/components/shared/Logo";
import { IconButton } from "@/components/shared/IconButton";
import { useTheme } from "@/components/shared/AntdThemeProvider";
import { SunIcon, MoonIcon, LogoutIcon } from "@/components/shared/icons";

function initialsOf(name: string | null, email: string) {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function AppHeader({
  user,
  showBrand = true,
}: {
  user: { email: string; name: string | null; role: string | null };
  showBrand?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="px-4 sm:px-7 py-3.5">
      <div
        className="flex items-center justify-between gap-3"
        style={{ maxWidth: 1120, margin: "0 auto" }}
      >
        {showBrand ? (
          <div style={{ color: "var(--foreground)" }} className="flex">
            <Logo size={24} />
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <IconButton label="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>

          <Avatar
            size="small"
            style={{
              background: "var(--gradient-violet)",
              color: "var(--gradient-violet-ink)",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {initialsOf(user.name, user.email)}
          </Avatar>

          <IconButton label="Log out" href="/auth/logout">
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
