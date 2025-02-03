import { calculateUptime } from "@/app/utils/uptime";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        // Authentication check
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

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

        // Check for existing URL for this user
        const existingSite = await prisma.site.findFirst({
            where: {
                url,
                userId: session.user.id
            }
        })

        if (existingSite) {
            return NextResponse.json(
                { error: 'URL already exists in your account' },
                { status: 409 }
            )
        }

        const site = await prisma.site.create({
            data: {
                name: name.trim(),
                url: url.trim(),
                userId: session.user.id  // Associate with user
            }
        })

        return NextResponse.json(site)

    } catch (error) {
        console.error('[SITES_POST] Error:', error)

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Site creation conflict' },
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
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const sites = await prisma.site.findMany({
            where: { userId: session.user.id }
        })

        const sitesWithUptime = sites.map(site => ({
            ...site,
            uptime: calculateUptime(site)
        }))

        return NextResponse.json(sitesWithUptime)

    } catch (error) {
        console.error('[SITES_GET] Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}