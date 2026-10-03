import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const smoochSans = localFont({
  src: "../assets/fonts/SmoochSans-Regular.ttf",
  variable: "--font-smooch-sans",
  display: "swap",
});

export const titilliumWeb = localFont({
  src: "../assets/fonts/TitilliumWeb-Regular.ttf",
  variable: "--font-titillium-web",
  display: "swap",
});

export const scienceGothic = localFont({
  src: "../assets/fonts/ScienceGothic-Regular.ttf",
  variable: "--font-science-gothic",
  display: "swap",
});

export const waterfall = localFont({
  src: "../assets/fonts/Waterfall-Regular.ttf",
  variable: "--font-waterfall",
  display: "swap",
});
