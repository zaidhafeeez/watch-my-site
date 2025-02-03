import CronInitializer from './init-cron'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import ClientProvider from '@/components/ClientProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: 'swap',
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata = {
  title: {
    default: "Watch My Site",
    template: "%s | Watch My Site"
  },
  description: "Real-time website monitoring with uptime statistics and performance metrics",
  keywords: ["website monitoring", "uptime checker", "status page", "performance metrics"],
  openGraph: {
    title: "Website Status Monitor",
    description: "Real-time website monitoring with uptime statistics and performance metrics",
    url: "https://yourdomain.com",
    siteName: "Status Monitor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Status Monitor",
    description: "Real-time website monitoring with uptime statistics and performance metrics",
    creator: "@yourhandle",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
};

export default function RootLayout({ children }) {
  const session = getServerSession(authOptions);

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`
        ${geistSans.variable} 
        ${geistMono.variable}
        font-sans antialiased
        bg-gray-50 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        min-h-screen flex flex-col
      `}>
        <ClientProvider session={session}>
          <CronInitializer />

          <Navbar session={session} />

          <main className="flex-1 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
              <SpeedInsights />
            </div>
          </main>

          <Footer />
        </ClientProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}