import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdThemeProvider } from "@/components/shared/AntdThemeProvider";
import { THEME_COOKIE, isTheme } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perimeter",
  description: "Clock in and out of shifts, gated by a location perimeter.",
};

// Runs before hydration, only matters on a visitor's very first request (no
// pm-theme cookie yet) — every later request already has the cookie, so the
// server sets the correct data-theme attribute itself and this is a no-op.
const NO_FLASH_SCRIPT = `
(function () {
  try {
    if (document.cookie.indexOf("${THEME_COOKIE}=") !== -1) return;
    var theme = "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.cookie = "${THEME_COOKIE}=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const initialTheme = isTheme(themeCookie) ? themeCookie : "light";

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="pm-no-flash-theme" strategy="beforeInteractive">
          {NO_FLASH_SCRIPT}
        </Script>
        <AntdRegistry>
          <AntdThemeProvider initialTheme={initialTheme}>
            <Auth0Provider>{children}</Auth0Provider>
          </AntdThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
