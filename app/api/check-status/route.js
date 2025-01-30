import axios from 'axios'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req) {
    try {
        // 1. Extract ID first
        const { id } = await req.json()

        // 2. Validate ID exists
        if (!id) {
            return NextResponse.json(
                { error: 'Missing site ID' },
                { status: 400 }
            )
        }

        // 3. Update status to checking
        await prisma.site.update({
            where: { id },
            data: { status: 'checking' }
        })

        // 4. Get site details
        const site = await prisma.site.findUnique({
            where: { id }
        })

        if (!site) {
            return NextResponse.json(
                { error: 'Site not found' },
                { status: 404 }
            )
        }

        // 5. Perform status check
        let status = 'down'
        let responseTime = 0

        try {
            const start = Date.now()
            const response = await axios.get(site.url, {
                timeout: 5000,
                validateStatus: () => true
            })
            responseTime = Date.now() - start
            status = response.status === 200 ? 'up' : 'down'
        } catch (error) {
            status = 'down'
        }

        // 6. Update final status
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

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[STATUS_CHECK_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}