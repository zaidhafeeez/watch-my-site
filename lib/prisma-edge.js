import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient({
  log: ['query'],
  datasourceUrl: process.env.DATABASE_URL,
})

export default prisma
