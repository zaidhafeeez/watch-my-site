import axios from 'axios'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

// Add initial status update before the check
await prisma.site.update({
    where: { id },
    data: { status: 'checking' }
})

export async function POST(req) {
    try {
        const { id } = await req.json()

        if (!id) {
            return NextResponse.json(
                { error: 'Missing site ID' },
                { status: 400 }
            )
        }

        const site = await prisma.site.findUnique({
            where: { id }
        })

        if (!site) {
            return NextResponse.json(
                { error: 'Site not found' },
                { status: 404 }
            )
        }

        let status = 'down'
        let responseTime = 0
        const start = Date.now()

        try {
            const response = await axios.get(site.url, {
                timeout: 5000,
                validateStatus: () => true // Accept all status codes
            })
            responseTime = Date.now() - start
            status = response.status === 200 ? 'up' : 'down'
        } catch (error) {
            responseTime = Date.now() - start
            status = 'down'
        }

        await prisma.$transaction([
            prisma.site.update({
                where: { id },
                data: {
                    status,
                    responseTime,
                    totalChecks: { increment: 1 },
                    successfulChecks: {
                        increment: status === 'up' ? 1 : 0
                    }
                }
            }),
            prisma.statusCheck.create({
                data: {
                    siteId: id,
                    status,
                    responseTime
                }
            })
        ])

        return NextResponse.json({
            status: 'success',
            siteStatus: status
        })

    } catch (error) {
        console.error('Error checking status:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}