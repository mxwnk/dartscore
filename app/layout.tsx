import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Version } from "./components/version";
import { ThemeProvider } from "./components/theme-provider";
import WakeLock from "./components/wake-lock";
import { META_THEME_COLOR_ID } from "./constants";

export const metadata: Metadata = {
  title: "Dart Scoreboard",
  description: "No ads. Track your dart scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#ffffff" id={META_THEME_COLOR_ID} />
        <Version />
      </head>
      <body style={{ margin: 0 }}>
        <WakeLock />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
