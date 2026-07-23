"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { IconButton } from "@/components/shared/IconButton";
import { HomeIcon, UsersIcon, ChartIcon } from "@/components/shared/icons";

const NAV_ITEMS = [
  { href: "/manager", label: "Overview", icon: HomeIcon },
  { href: "/manager/live", label: "Staff & Live Status", icon: UsersIcon },
  { href: "/manager/dashboard", label: "Analytics", icon: ChartIcon },
];

export function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:w-[240px] md:h-screen md:sticky md:top-0 md:flex md:flex-col md:py-8 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:w-full max-md:h-[70px] max-md:bg-[var(--surface)] max-md:border-t max-md:border-[var(--border)] max-md:z-50 max-md:flex max-md:items-center max-md:px-6">
      <div className="max-md:hidden pl-8" style={{ color: "var(--foreground)", marginBottom: 64 }}>
        <Logo size={24} />
      </div>

      <nav className="flex md:flex-col gap-6 max-md:w-full max-md:justify-around max-md:items-center md:pl-8">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/manager"
              ? pathname === "/manager"
              : pathname.startsWith(href);
          return (
            <IconButton key={href} href={href} label={label} active={active}>
              <Icon size={22} />
            </IconButton>
          );
        })}
      </nav>
    </aside>
  );
}
