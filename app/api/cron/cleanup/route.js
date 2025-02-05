import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const AUTH_TOKEN = process.env.CRON_SECRET
const RETENTION_DAYS = 30

export async function POST(req) {
    const authHeader = req.headers.get('authorization')

    if (authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const startTime = Date.now()
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS)

        // Delete old checks in batches
        const { count } = await prisma.statusCheck.deleteMany({
            where: {
                timestamp: { lt: cutoffDate }
            }
        })

        // Clean up orphaned data
        const cleanupResult = await prisma.$transaction([
            prisma.site.deleteMany({
                where: { user: null }
            }),
            prisma.user.deleteMany({
                where: {
                    AND: [
                        { emailVerified: null },
                        { createdAt: { lt: cutoffDate } }
                    ]
                }
            })
        ])

        return NextResponse.json({
            success: true,
            deletedChecks: count,
            cleanedOrphanedData: {
                sites: cleanupResult[0].count,
                users: cleanupResult[1].count
            },
            retentionDays: RETENTION_DAYS,
            durationMs: Date.now() - startTime
        })

    } catch (error) {
        console.error('[CLEANUP] Error:', error)
        return NextResponse.json(
            { error: 'Cleanup failed' },
            { status: 500 }
        )
    }
}