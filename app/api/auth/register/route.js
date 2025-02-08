import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/auth-utils'
import { randomBytes } from 'crypto'

export async function POST(request) {
    try {
        const { name, email, password } = await request.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Validate password
        const { isValid, error } = validatePassword(password)
        if (!isValid) {
            return NextResponse.json({ message: error }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 400 }
            )
        }

        // Generate verification token
        const verificationToken = randomBytes(32).toString('hex')

        // Create user
        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                emailVerified: null,
                verificationToken
            }
        })

        // Send verification email
        // TODO: Implement email sending functionality
        // await sendVerificationEmail(user.email, verificationToken)

        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
