import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Motion Foundry — Premium motion for the web",
    template: "%s — Motion Foundry",
  },
  description:
    "A carefully crafted library of 50 premium animation patterns for Next.js and React. Preview, inspect, and copy the motion you need.",
  applicationName: "Motion Foundry",
  keywords: [
    "Next.js animations",
    "React motion",
    "copy paste components",
    "GSAP inspiration",
    "motion design",
    "open source UI",
  ],
  openGraph: {
    title: "Motion Foundry",
    description: "50 premium motion patterns. Preview them. Copy them. Make them yours.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
