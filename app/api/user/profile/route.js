import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth/options'

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { name, email } = await request.json()

        // Validate input
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            )
        }

        // Check if email is already taken by another user
        if (email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            })

            if (existingUser) {
                return NextResponse.json(
                    { message: 'Email already taken' },
                    { status: 400 }
                )
            }
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email: email.toLowerCase(),
                updatedAt: new Date()
            }
        })

        // Log the activity
        await prisma.accountActivity.create({
            data: {
                userId: session.user.id,
                action: 'PROFILE_UPDATE',
                description: 'Profile information updated'
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
