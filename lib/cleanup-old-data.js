import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'

const prisma = new PrismaClient()

export function startDataCleanupJob() {
    // Run every day at 3 AM
    cron.schedule('0 3 * * *', async () => {
        try {
            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - 1) // 24 hours ago

            const { count } = await prisma.statusCheck.deleteMany({
                where: {
                    timestamp: {
                        lt: cutoffDate
                    }
                }
            })

            console.log(`Deleted ${count} old status checks`)

        } catch (error) {
            console.error('Data cleanup failed:', error)
        } finally {
            await prisma.$disconnect()
        }
    })
}