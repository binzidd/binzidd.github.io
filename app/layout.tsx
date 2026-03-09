import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Binay Siddharth — Data & GenAI Leader",
  description:
    "Chapter Area Lead - FS Analytics at Commonwealth Bank of Australia. 9 years of analytics experience, GenAI practitioner, HCI specialist, and people leader.",
  keywords: [
    "Binay Siddharth",
    "Data Analytics",
    "GenAI",
    "LangGraph",
    "RAG",
    "Commonwealth Bank",
    "HCI",
    "Tableau",
    "AWS",
  ],
  openGraph: {
    title: "Binay Siddharth — Data & GenAI Leader",
    description:
      "Transforming finance analytics through GenAI, ML, and HCI-driven design thinking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
