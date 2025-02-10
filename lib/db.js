import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = /** @type {{ prisma: PrismaClient }} */ (global)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
