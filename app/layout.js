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

// Add progressive features:
// - PWA support
// - Offline capabilities
// - Push notifications
// - Real-time updates
// - Background sync

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
          <div className="relative z-0">
            <CronInitializer />
            <Navbar session={session} />
            <main className="flex-1">
              {children}
              <SpeedInsights />
            </main>
            <Footer />
          </div>
        </ClientProvider>
        <Toaster richColors position="top-right" />
        {/* Modals will be rendered here by Portal */}
      </body>
    </html>
  );
}