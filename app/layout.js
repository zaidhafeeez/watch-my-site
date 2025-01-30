import CronInitializer from './init-cron'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Website Status Monitor",
    template: "%s | Status Monitor"
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
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body className={`
        ${geistSans.variable} 
        ${geistMono.variable}
        font-sans antialiased
        bg-gray-50 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        min-h-screen
      `}>
        <CronInitializer />

        <main className="min-h-screen flex flex-col">
          {children}
        </main>

        {/* Optional footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Status Monitor. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}