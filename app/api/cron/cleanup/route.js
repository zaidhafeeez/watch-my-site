import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const AUTH_TOKEN = process.env.CRON_SECRET

export async function GET(req) {
    const authHeader = req.headers.get('authorization')

    if (authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - 1)

        const { count } = await prisma.statusCheck.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate
                }
            }
        })

        return NextResponse.json({
            success: true,
            deletedEntries: count
        })

    } catch (error) {
        console.error('Cleanup error:', error)
        return NextResponse.json(
            { error: 'Cleanup failed' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}