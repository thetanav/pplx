import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import Menu from "@/components/settings";
import { Toaster } from "sonner";

const sans = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pplx.local"),
  title: {
    default: "PPLX Chat",
    template: "%s • PPLX Chat",
  },
  description:
    "Chat UI with models from OpenRouter, Groq, Google and Perplexity",
  applicationName: "PPLX Chat",
  keywords: [
    "AI",
    "chat",
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
    title: "PPLX Chat",
    description:
      "Chat UI with models from OpenRouter, Groq, Google and Perplexity",
    url: "/",
    siteName: "PPLX Chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "PPLX Chat",
    description:
      "Chat UI with models from OpenRouter, Groq, Google and Perplexity",
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <Menu />
          <Toaster position="top-right" richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
