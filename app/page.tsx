import type { Metadata } from 'next'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import Link from 'next/link'
import { features } from '@/constants/features'
import { getSiteHealth } from "@/app/utils/monitoring"
import type { Site } from '@/lib/types'

export const metadata: Metadata = {
    title: 'Home',
    description: 'Monitor your website uptime and performance'
}

export default async function Home() {
    const session = await getServerSession(authOptions)

    const formatSiteStats = (sites: Site[]) => {
        return sites.map(site => ({
            ...site,
            health: getSiteHealth(site)
        }))
    }

    // ...rest of existing code...
}
