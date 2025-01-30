import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateUptime } from "@/app/utils/uptime";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { name, url } = await req.json()

        // Validate input
        if (!name || !url) {
            return NextResponse.json(
                { error: 'Name and URL are required' },
                { status: 400 }
            )
        }

        // Validate URL format
        try {
            new URL(url)
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            )
        }

        const site = await prisma.site.create({
            data: {
                name,
                url,
                status: 'checking',
                successfulChecks: 0,
                totalChecks: 0
            }
        })

        return NextResponse.json(site)

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to create site' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function GET() {
    const sites = await prisma.site.findMany()
    const sitesWithUptime = sites.map(site => ({
        ...site,
        uptime: calculateUptime(site)
    }))

    return NextResponse.json(sitesWithUptime)
}