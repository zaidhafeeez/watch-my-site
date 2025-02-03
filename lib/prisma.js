import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ['query'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    }).$extends(withAccelerate())
    .$extends({
        query: {
            $allOperations({ operation, model, args, query }) {
                const start = performance.now()
                return query(args).finally(() => {
                    const end = performance.now()
                    console.log(`${model}.${operation} took ${end - start}ms`)
                })
            }
        }
    })
}

// Remove TypeScript types and use plain JavaScript
const globalForPrisma = global
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton()
}

const prisma = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma