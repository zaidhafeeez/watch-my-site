const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('temporarypassword', 12)
  
  const defaultUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@watchmysite.com",
      password: hashedPassword,
      emailVerified: new Date(),
    }
  })

  // Assign existing sites to admin user
  await prisma.site.updateMany({
    data: { userId: defaultUser.id }
  })

  console.log('Seeded admin user and assigned existing sites')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })