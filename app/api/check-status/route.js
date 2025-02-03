import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-edge";

export const runtime = 'edge'
export const preferredRegion = 'auto'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req) {
    try {
        // Check for cron auth token
        const authHeader = req.headers.get('authorization')
        const isCronJob = authHeader === `Bearer ${process.env.CRON_SECRET}`
        
        const { id } = await req.json()
        
        // If it's a cron job, check all sites
        if (isCronJob && !id) {
            return await handleBulkCheck()
        }

        // Otherwise, check single site
        return await handleSingleCheck(id)

    } catch (error) {
        console.error('[CHECK_STATUS] Error:', error)
        return NextResponse.json(
            { error: 'Failed to check site status' },
            { status: 500 }
        )
    }
}

async function handleSingleCheck(id) {
    const startTime = Date.now()
    const site = await prisma.site.findUnique({
        where: { id },
        select: { url: true }
    })

    if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const result = await checkSite(site.url)
    await updateSiteStatus(id, result)

    return NextResponse.json({
        status: result.status,
        responseTime: result.responseTime,
        timestamp: new Date().toISOString()
    })
}

async function handleBulkCheck() {
    const sites = await prisma.site.findMany({
        select: { id: true, url: true }
    })

    const results = await Promise.all(
        sites.map(async (site) => {
            const result = await checkSite(site.url)
            await updateSiteStatus(site.id, result)
            return { siteId: site.id, ...result }
        })
    )

    return NextResponse.json({
        success: true,
        checked: results.length,
        results
    })
}

async function checkSite(url) {
    const startTime = Date.now()
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': 'WatchMySite Monitor/1.0' }
        })
        
        const responseTime = Date.now() - startTime
        return {
            status: response.ok ? 'up' : 'down',
            responseTime,
            statusCode: response.status
        }
    } catch (error) {
        return {
            status: 'down',
            responseTime: Date.now() - startTime,
            error: error.message
        }
    }
}

async function updateSiteStatus(siteId, result) {
    const isUp = result.status === 'up'
    
    await prisma.$transaction([
        prisma.statusCheck.create({
            data: {
                siteId,
                status: result.status,
                responseTime: result.responseTime
            }
        }),
        prisma.site.update({
            where: { id: siteId },
            data: {
                status: result.status,
                responseTime: result.responseTime,
                totalChecks: { increment: 1 },
                successfulChecks: isUp ? { increment: 1 } : undefined
            }
        })
    ])
}