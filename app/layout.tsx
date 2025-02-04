import type { Metadata, Viewport } from 'next'
// ...existing imports...

export const metadata: Metadata = {
    // ...existing metadata...
}

export const viewport: Viewport = {
    // ...existing viewport...
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const session = await getServerSession(authOptions)

    // ...rest of the existing code...
}
