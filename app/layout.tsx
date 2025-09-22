import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import Menu from "@/components/settings";
import { Toaster } from "sonner";

const sans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pplx.local"),
  title: {
    default: "Simp Chat",
    template: "%s • Simp Chat",
  },
  description: "Simp chat with lots of models and mcp client.",
  applicationName: "Simp Chat",
  keywords: [
    "AI",
    "chat",
    "mcp client",
    "Next.js",
    "OpenRouter",
    "Groq",
    "Perplexity",
    "Gemini",
  ],
  authors: [{ name: "tanav", url: "https://tanavindev.tech" }],
  creator: "tanav",
  openGraph: {
    type: "website",
    title: "Simp Chat",
    description: "Simp chat with lots of models and mcp client.",
    url: "/",
    siteName: "Simp Chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simp Chat",
    description: "Simp chat with lots of models and mcp client.",
    creator: "@tanav",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.className} antialiased min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange>
          <Menu />
          <Toaster position="top-right" richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
