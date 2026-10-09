import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Motion Shelf — an independent motion library", template: "%s — Motion Shelf" },
  description: "A growing, open-source collection of copyable motion studies for React and the web. Preview each effect, inspect the code, and adapt it to your project.",
  applicationName: "Motion Shelf",
  keywords: ["CSS animation", "React motion", "copy paste animation", "open source motion library", "web animation"],
  authors: [{ name: "Sohail Khan", url: "https://github.com/SohailKhan0525" }],
  creator: "Sohail Khan",
  openGraph: {
    title: "Motion Shelf",
    description: "A small, independent motion library. Preview the effect, inspect the code, make it your own.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#f4f2ec", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
