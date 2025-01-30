import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

let cronStarted = false

export function startCronJobs() {
    if (cronStarted) return

    cronStarted = true

    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        const sites = await prisma.site.findMany()

        for (const site of sites) {
            try {
                const start = Date.now()
                const response = await axios.get(site.url, { timeout: 5000 })
                const responseTime = Date.now() - start
                const isUp = response.status === 200

                await prisma.$transaction([
                    prisma.site.update({
                        where: { id: site.id },
                        data: {
                            status: isUp ? 'up' : 'down',
                            responseTime,
                            totalChecks: { increment: 1 },
                            successfulChecks: { increment: isUp ? 1 : 0 }
                        }
                    }),
                    prisma.statusCheck.create({
                        data: {
                            siteId: site.id,
                            status: isUp ? 'up' : 'down',
                            responseTime
                        }
                    })
                ])
            } catch (error) {
                await prisma.$transaction([
                    prisma.site.update({
                        where: { id: site.id },
                        data: {
                            status: 'down',
                            totalChecks: { increment: 1 }
                        }
                    }),
                    prisma.statusCheck.create({
                        data: {
                            siteId: site.id,
                            status: 'down',
                            responseTime: 0
                        }
                    })
                ])
            }
        }
    })
}