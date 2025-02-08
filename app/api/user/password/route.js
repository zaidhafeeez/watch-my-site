import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth/options'
import { hashPassword, verifyPassword, validatePassword } from '@/lib/auth-utils'

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { currentPassword, newPassword } = await request.json()

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required' },
                { status: 400 }
            )
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.password)
        if (!isValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        // Validate new password
        const { isValid: isValidNew, error } = validatePassword(newPassword)
        if (!isValidNew) {
            return NextResponse.json(
                { message: error },
                { status: 400 }
            )
        }

        // Hash and update new password
        const hashedPassword = await hashPassword(newPassword)
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        })

        // Log the activity
        await prisma.accountActivity.create({
            data: {
                userId: session.user.id,
                action: 'PASSWORD_CHANGE',
                description: 'Password changed successfully'
            }
        })

        return NextResponse.json({
            message: 'Password updated successfully'
        })

    } catch (error) {
        console.error('Password update error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
