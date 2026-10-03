import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import {
  geistSans,
  geistMono,
  scienceGothic,
  smoochSans,
  titilliumWeb,
  waterfall,
} from "@/utils/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Gupta — Creative Frontend Developer & 3D Web Experiences",
  description:
    "Portfolio of Akash Gupta, a Creative Frontend Developer crafting high-performance, responsive web interfaces, interactive 3D WebGL experiences, and modern web applications with React, Next.js, and TypeScript.",
  keywords: [
    "Akash Gupta",
    "Frontend Developer",
    "Creative Web Developer",
    "3D Web Development",
    "Next.js Portfolio",
    "React",
    "TypeScript",
    "Three.js",
    "WebGL",
  ],
  authors: [{ name: "Akash Gupta" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${scienceGothic.variable} ${smoochSans.variable} ${titilliumWeb.variable} ${waterfall.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/models/crystal_spider.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
