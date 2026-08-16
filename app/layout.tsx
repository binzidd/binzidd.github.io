import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeInit from "@/components/ThemeInit";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Binay Siddharth - Data & GenAI Leader",
  description:
    "Chapter Area Lead (Executive Manager), FS Analytics at Commonwealth Bank of Australia. 12+ years in data, GenAI practitioner shipping agentic AI to production, and people leader.",
  keywords: [
    "Binay Siddharth",
    "Data Analytics",
    "GenAI",
    "LangGraph",
    "RAG",
    "Commonwealth Bank",
    "Agentic AI",
    "AWS",
  ],
  openGraph: {
    title: "Binay Siddharth - Data & GenAI Leader",
    description:
      "Transforming finance operations through agentic AI, governed data, and execution at scale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/*
          GitHub Pages cannot set HTTP security headers, so these meta equivalents
          are the best available mitigations for a static export. frame-ancestors
          is deliberately absent: browsers ignore it when delivered via <meta>,
          so including it only emitted a console warning on every page load.
          'unsafe-inline' is required by Framer Motion (inline style mutations).
        */}
        <meta httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.github.com https://script.google.com https://script.googleusercontent.com;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="permissions-policy" content="geolocation=(), microphone=(), camera=()" />
        {/*
          Apply the saved theme before first paint. Without this the page
          renders in the default theme for a frame and then snaps, which is
          exactly the flash a theme choice is supposed to feel deliberate about.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="matrix"||t==="interstellar"){document.documentElement.dataset.theme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
