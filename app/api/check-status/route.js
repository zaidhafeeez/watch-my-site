import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

export async function POST(req) {
    const { id } = await req.json()
    const site = await prisma.site.findUnique({ where: { id } })

    try {
        const start = Date.now()
        const response = await axios.get(site.url, { timeout: 5000 })
        const responseTime = Date.now() - start
        const isUp = response.status === 200

        // Update site status and metrics
        await prisma.$transaction([
            prisma.site.update({
                where: { id },
                data: {
                    status: isUp ? 'up' : 'down',
                    responseTime,
                    totalChecks: { increment: 1 },
                    successfulChecks: { increment: isUp ? 1 : 0 }
                }
            }),
            prisma.statusCheck.create({
                data: {
                    siteId: id,
                    status: isUp ? 'up' : 'down',
                    responseTime
                }
            })
        ])

        return NextResponse.json({ status: 'success' })
    } catch (error) {
        await prisma.$transaction([
            prisma.site.update({
                where: { id },
                data: {
                    status: 'down',
                    totalChecks: { increment: 1 }
                }
            }),
            prisma.statusCheck.create({
                data: {
                    siteId: id,
                    status: 'down',
                    responseTime: 0
                }
            })
        ])
        return NextResponse.json({ status: 'error' })
    }
}