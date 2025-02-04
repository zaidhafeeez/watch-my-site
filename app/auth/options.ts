import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
// ...existing imports...

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // ...rest of existing config...
}
