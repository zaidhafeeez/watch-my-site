import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// 1. Define auth options
const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) return null

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                return isValid ? user : null
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/auth/signin" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id
            return session
        }
    }
}

// 2. Create handler
const handler = NextAuth(authOptions)

// 3. Export named handlers
export { handler as GET, handler as POST }