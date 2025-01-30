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

        await prisma.site.update({
            where: { id },
            data: {
                status: response.status === 200 ? 'up' : 'down',
                responseTime,
                uptime: response.status === 200 ? site.uptime + 1 : site.uptime
            }
        })

        return NextResponse.json({ status: 'success' })
    } catch (error) {
        await prisma.site.update({
            where: { id },
            data: { status: 'down' }
        })
        return NextResponse.json({ status: 'error' })
    }
}