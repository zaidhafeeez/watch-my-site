import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-edge";

export const runtime = 'edge'
export const preferredRegion = 'auto'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req) {
    try {
        const { id } = await req.json()

        const startTime = Date.now()
        
        // Use a single query instead of transaction in Edge
        const site = await prisma.site.findUnique({
            where: { id },
            select: { url: true }
        })

        if (!site) {
            return NextResponse.json(
                { error: 'Site not found' },
                { status: 404 }
            )
        }

        const response = await fetch(site.url, {
            method: 'GET',
            headers: {
                'User-Agent': 'WatchMySite Status Monitor'
            }
        })

        const endTime = Date.now()
        const responseTime = endTime - startTime
        const status = response.ok ? 'up' : 'down'

        // Create status check
        await prisma.statusCheck.create({
            data: {
                siteId: id,
                status,
                responseTime
            }
        })

        // Update site status
        await prisma.site.update({
            where: { id },
            data: {
                status,
                responseTime,
                totalChecks: { increment: 1 },
                successfulChecks: status === 'up' ? { increment: 1 } : undefined
            }
        })

        return NextResponse.json({
            status,
            responseTime,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('[CHECK_STATUS] Error:', error)
        return NextResponse.json(
            { error: 'Failed to check site status' },
            { status: 500 }
        )
    }
}