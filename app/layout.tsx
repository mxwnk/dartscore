import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import theme from './theme';

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
