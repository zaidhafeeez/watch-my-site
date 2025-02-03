import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";
import { getSiteHealth } from "@/app/utils/monitoring";

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

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
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
                userId: user.id
            }
        })

        if (existingSite) {
            return NextResponse.json(
                { error: 'URL already exists in your account' },
                { status: 409 }
            )
        }

        // Create site with explicit transaction
        const site = await prisma.$transaction(async (tx) => {
            return tx.site.create({
                data: {
                    name: name.trim(),
                    url: url.trim(),
                    userId: user.id
                }
            });
        });

        return NextResponse.json({ 
            site,
            message: 'Site added successfully'
        });

    } catch (error) {
        console.error('[SITES_POST] Error:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Site already exists in your account' },
                { status: 409 }
            );
        }

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: 'Invalid user reference' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
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
            }
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