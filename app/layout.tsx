import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";

const sans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simpchat.vercel.app"),
  title: {
    default: "AI Chat",
    template: "%s • AI Chat",
  },
  description: "AI chat with lots of models and tools.",
  applicationName: "AI Chat",
  keywords: ["AI", "chat", "OpenRouter", "Groq", "Perplexity", "Gemini"],
  authors: [{ name: "tanav", url: "https://tanavindev.tech" }],
  creator: "tanav",
  openGraph: {
    type: "website",
    title: "AI Chat",
    description: "AI chat with lots of models and tools.",
    url: "/",
    siteName: "AI Chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat",
    description: "AI chat with lots of models and tools.",
    creator: "@tanav_twt",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
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
          enableSystem
          disableTransitionOnChange>
          <Toaster position="top-right" closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
