import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user
                }
                return null
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            return session
        }
    }
}
