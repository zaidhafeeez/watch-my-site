import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  log: ['query'],
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

export default prisma
