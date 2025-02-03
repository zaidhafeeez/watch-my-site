import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'

const prisma = new PrismaClient()
const RETENTION_HOURS = 24
const CLEANUP_SCHEDULE = '0 */1 * * *' // Run every hour

export function startDataCleanupJob() {
    cron.schedule(CLEANUP_SCHEDULE, async () => {
        console.log('[CLEANUP] Starting data cleanup:', new Date().toISOString())
        
        try {
            const cutoffDate = new Date()
            cutoffDate.setHours(cutoffDate.getHours() - RETENTION_HOURS)

            // Delete old checks in batches
            const { count } = await prisma.statusCheck.deleteMany({
                where: {
                    timestamp: {
                        lt: cutoffDate
                    }
                }
            })

            // Update site statistics after cleanup
            await updateSiteStats()

            console.log(`[CLEANUP] Deleted ${count} old status checks`)
            console.log(`[CLEANUP] Retention period: ${RETENTION_HOURS} hours`)

        } catch (error) {
            console.error('[CLEANUP] Data cleanup failed:', error)
        }
    })
}

async function updateSiteStats() {
    const sites = await prisma.site.findMany({
        select: { id: true }
    })

    for (const site of sites) {
        try {
            const checks = await prisma.statusCheck.findMany({
                where: { siteId: site.id },
                orderBy: { timestamp: 'desc' },
                take: 1
            })

            if (checks.length > 0) {
                const lastCheck = checks[0]
                await prisma.site.update({
                    where: { id: site.id },
                    data: {
                        status: lastCheck.status,
                        responseTime: lastCheck.responseTime
                    }
                })
            }
        } catch (error) {
            console.error(`[CLEANUP] Error updating stats for site ${site.id}:`, error)
        }
    }
}