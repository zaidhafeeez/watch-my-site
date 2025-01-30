import { calculateUptime } from "@/app/utils/uptime";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { name, url } = await req.json()

        // Validate input
        if (!name?.trim() || !url?.trim()) {
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

        // Check for existing URL
        const existingSite = await prisma.site.findFirst({
            where: { url }
        })

        if (existingSite) {
            return NextResponse.json(
                { error: 'URL already exists' },
                { status: 409 }
            )
        }

        const site = await prisma.site.create({
            data: {
                name: name.trim(),
                url: url.trim(),
            }
        })

        return NextResponse.json(site)

    } catch (error) {
        console.error('[SITES_POST] Error:', error)

        // Handle Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Site with this URL already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
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