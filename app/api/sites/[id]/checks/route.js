import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth/options'

export async function GET(request, context) {
    try {
        const session = await getServerSession(authOptions)
        const { params } = await context

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const timeRange = searchParams.get('timeRange') || '24h'

        // Calculate the date range
        const now = new Date()
        const rangeDate = new Date()
        switch (timeRange) {
            case '7d':
                rangeDate.setDate(now.getDate() - 7)
                break
            case '30d':
                rangeDate.setDate(now.getDate() - 30)
                break
            default: // 24h
                rangeDate.setDate(now.getDate() - 1)
        }

        const checks = await prisma.statusCheck.findMany({
            where: {
                siteId: params.id,
                timestamp: {
                    gte: rangeDate
                }
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 100 // Limit to last 100 checks
        })

        return NextResponse.json(checks)
    } catch (error) {
        console.error('Checks fetch error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
