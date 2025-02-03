import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";
import { getSiteHealth } from "@/app/utils/monitoring";

// Remove edge runtime config for auth routes
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

        // Verify user with caching
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true },
            cacheStrategy: { ttl: 60 }
        });

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

        // Check for existing URL for this user with cache
        const existingSite = await prisma.site.findFirst({
            where: {
                url,
                userId: user.id
            },
            select: { id: true },
            cacheStrategy: { ttl: 30 }
        })

        if (existingSite) {
            return NextResponse.json(
                { error: 'URL already exists' },
                { status: 409 }
            )
        }

        // Create site with optimized transaction
        const site = await prisma.site.create({
            data: {
                name: name.trim(),
                url: url.trim(),
                userId: user.id
            },
            include: {
                checks: {
                    orderBy: { timestamp: 'desc' },
                    take: 10
                }
            }
        })

        return NextResponse.json({ 
            site,
            message: 'Site added successfully'
        });

    } catch (error) {
        console.error('[SITES_POST] Error:', error);
        return NextResponse.json(
            { error: 'Failed to add site' },
            { status: 500 }
        );
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
            where: { userId: session.user.id },
            include: {
                checks: {
                    orderBy: { timestamp: "desc" },
                    take: 10
                }
            },
            cacheStrategy: { ttl: 30 } // Cache for 30 seconds
        })

        const sitesWithHealth = sites.map(site => ({
            ...site,
            health: getSiteHealth(site)
        }))

        return NextResponse.json(sitesWithHealth)

    } catch (error) {
        console.error('[SITES_GET] Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}