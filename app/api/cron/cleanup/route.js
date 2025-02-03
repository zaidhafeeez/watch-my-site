import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const AUTH_TOKEN = process.env.CRON_SECRET
const RETENTION_HOURS = 24

export async function GET(req) {
    const authHeader = req.headers.get('authorization')

    if (authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const startTime = Date.now()
        const cutoffDate = new Date()
        cutoffDate.setHours(cutoffDate.getHours() - RETENTION_HOURS)

        // Delete old checks in smaller batches
        const { count } = await prisma.statusCheck.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate
                }
            }
        })

        // Update site statistics after cleanup
        const sites = await prisma.site.findMany({
            select: { id: true }
        })

        for (const site of sites) {
            const latestCheck = await prisma.statusCheck.findFirst({
                where: { siteId: site.id },
                orderBy: { timestamp: 'desc' }
            })

            if (latestCheck) {
                await prisma.site.update({
                    where: { id: site.id },
                    data: {
                        status: latestCheck.status,
                        responseTime: latestCheck.responseTime
                    }
                })
            }
        }

        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            deletedChecks: count,
            updatedSites: sites.length,
            retentionHours: RETENTION_HOURS,
            durationMs: duration
        })

    } catch (error) {
        console.error('[CRON_CLEANUP] Error:', error)
        return NextResponse.json(
            { error: 'Cleanup failed' },
            { status: 500 }
        )
    }
}