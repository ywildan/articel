import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Artikel — Baca & Kelola Tulisan",
    template: "%s · Artikel",
  },
  description:
    "Platform artikel modern dengan dashboard admin lengkap. Baca, cari, dan komentari tulisan favoritmu.",
};

const antiFlash = `
(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlash }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <BackgroundGlow />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-brand-500/20 blur-[120px] animate-float" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[120px] animate-float [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px] animate-float [animation-delay:4s]" />
    </div>
  );
}
