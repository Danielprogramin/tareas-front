"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} enableSystem attribute="class" defaultTheme="system">
      {children}
    </NextThemesProvider>
  )
}

function useTheme() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme("system")
    }
  }, [])

  const setAppTheme = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    localStorage.setItem("theme", theme)
  }

  return { theme, setTheme: setAppTheme }
}

export { ThemeProvider, useTheme }
