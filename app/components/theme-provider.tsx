"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { useEffect } from "react"
import { META_THEME_COLOR_ID } from "../constants"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MetaThemeProvider>
        {children}
      </MetaThemeProvider>
    </NextThemesProvider>
  )
}

function MetaThemeProvider({ children }: React.PropsWithChildren) {
  const { theme } = useTheme();
  useEffect(() => {
    const metaThemeColor = document.getElementById(META_THEME_COLOR_ID);
    if (theme === "dark") {
      metaThemeColor?.setAttribute("content", "#11111e");
    } else {
      metaThemeColor?.setAttribute("content", "#f8fbff");
    }
  }, [theme])
  return children;
}