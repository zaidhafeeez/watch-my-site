import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-edge";
import { performAdvancedHealthCheck } from "@/lib/services/healthCheck";

export const runtime = 'edge'
export const preferredRegion = 'auto'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req) {
    try {
        const authHeader = req.headers.get('authorization')
        const isCronJob = authHeader === `Bearer ${process.env.CRON_SECRET}`
        
        const { id } = await req.json()
        
        if (isCronJob && !id) {
            return await handleBulkCheck()
        }

        return await handleSingleCheck(id)

    } catch (error) {
        console.error('[CHECK_STATUS] Error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to check site status',
                details: error.message,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}

async function handleSingleCheck(id) {
    const site = await prisma.site.findUnique({
        where: { id },
        select: { 
            id: true,
            url: true,
            name: true,
            status: true,
            successfulChecks: true,
            totalChecks: true 
        }
    })

    if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const result = await performAdvancedHealthCheck(site)
    await updateSiteStatus(site.id, result)

    return NextResponse.json({
        siteId: site.id,
        url: site.url,
        ...result,
        timestamp: new Date().toISOString()
    })
}

async function handleBulkCheck() {
    const sites = await prisma.site.findMany({
        select: { 
            id: true, 
            url: true,
            name: true,
            status: true 
        }
    })

    const results = await Promise.allSettled(
        sites.map(async (site) => {
            try {
                const result = await performAdvancedHealthCheck(site)
                await updateSiteStatus(site.id, result)
                return { 
                    success: true,
                    siteId: site.id,
                    name: site.name,
                    ...result 
                }
            } catch (error) {
                return {
                    success: false,
                    siteId: site.id,
                    name: site.name,
                    error: error.message
                }
            }
        })
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
            total: sites.length,
            successful,
            failed
        },
        results: results.map(r => r.value || r.reason)
    })
}

async function updateSiteStatus(siteId, result) {
    const isUp = result.status === 'healthy'
    
    await prisma.$transaction([
        prisma.statusCheck.create({
            data: {
                siteId,
                status: result.status,
                responseTime: result.responseTime,
                statusCode: result.statusCode,
                headers: result.headers || null,
                sslInfo: result.ssl || null,
                dnsInfo: result.dns || null,
                error: result.error || null
            }
        }),
        prisma.site.update({
            where: { id: siteId },
            data: {
                status: result.status,
                responseTime: result.responseTime,
                totalChecks: { increment: 1 },
                successfulChecks: isUp ? { increment: 1 } : undefined,
                lastChecked: new Date(),
                lastStatusChange: result.status !== result.previousStatus ? new Date() : undefined
            }
        })
    ])
}