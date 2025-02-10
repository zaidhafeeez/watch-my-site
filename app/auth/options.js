import { verifyPassword } from "@/lib/auth-utils"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import prisma from "@/lib/db"

export const authOptions = {
    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember me", type: "checkbox" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase() }
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.emailVerified) {
                    throw new Error("Please verify your email first");
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/auth/signin",
        verifyRequest: "/auth/verify-request",
        error: "/auth/error",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async signIn({ user, account, profile }) {
            if (account.provider === "github") {
                // Log the GitHub sign in
                await prisma.accountActivity.create({
                    data: {
                        userId: user.id,
                        action: 'GITHUB_SIGNIN',
                        description: `Signed in with GitHub (${profile.login})`
                    }
                })
            }
            return true
        }
    },
    events: {
        async signIn({ user, account }) {
            if (account?.provider === "credentials") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() }
                });
            }
        }
    }
};