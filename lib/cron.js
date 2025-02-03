import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()
const CHECK_INTERVAL = '*/5 * * * *' // Every 5 minutes
const MONITOR_TIMEOUT = 5000 // 5 seconds timeout
let cronStarted = false

export function startCronJobs() {
    if (cronStarted) return
    cronStarted = true

    cron.schedule(CHECK_INTERVAL, async () => {
        console.log('[CRON] Starting site checks:', new Date().toISOString())
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/check-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CRON_SECRET}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })

            const data = await response.json()
            console.log(`[CRON] Checked ${data.checked} sites`)

        } catch (error) {
            console.error('[CRON] Error in cron job:', error)
        }
    })
}

async function checkSite(site) {
    const startTime = Date.now()
    
    try {
        const response = await axios.get(site.url, {
            timeout: MONITOR_TIMEOUT,
            validateStatus: null, // Don't throw on any status
            headers: {
                'User-Agent': 'WatchMySite Monitor/1.0'
            }
        })

        const responseTime = Date.now() - startTime
        const isUp = response.status >= 200 && response.status < 400

        await createStatusCheck(site.id, {
            status: isUp ? 'up' : 'down',
            responseTime,
            statusCode: response.status
        })

    } catch (error) {
        console.error(`[CRON] Error checking site ${site.name}:`, error.message)
        
        await createStatusCheck(site.id, {
            status: 'down',
            responseTime: Date.now() - startTime,
            statusCode: error.response?.status || 0,
            error: error.code || 'UNKNOWN_ERROR'
        })
    }
}

async function createStatusCheck(siteId, data) {
    try {
        await prisma.$transaction([
            // Create new status check
            prisma.statusCheck.create({
                data: {
                    siteId,
                    status: data.status,
                    responseTime: data.responseTime
                }
            }),
            // Update site stats
            prisma.site.update({
                where: { id: siteId },
                data: {
                    status: data.status,
                    responseTime: data.responseTime,
                    totalChecks: { increment: 1 },
                    successfulChecks: data.status === 'up' ? { increment: 1 } : undefined,
                    updatedAt: new Date()
                }
            })
        ])
    } catch (error) {
        console.error(`[CRON] Error creating status check for site ${siteId}:`, error)
    }
}