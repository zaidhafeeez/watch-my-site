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

        const site = await prisma.site.findFirst({
            where: {
                id: params.id,
                userId: session.user.id
            }
        })

        if (!site) {
            return NextResponse.json(
                { message: 'Site not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(site)
    } catch (error) {
        console.error('Site fetch error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request, context) {
    try {
        const session = await getServerSession(authOptions)
        const { params } = await context

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const site = await prisma.site.findFirst({
            where: {
                id: params.id,
                userId: session.user.id
            }
        })

        if (!site) {
            return NextResponse.json(
                { message: 'Site not found' },
                { status: 404 }
            )
        }

        await prisma.site.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Site deleted successfully'
        })
    } catch (error) {
        console.error('Site deletion error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
