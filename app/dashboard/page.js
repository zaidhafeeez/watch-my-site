import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import DashboardContent from "@/components/DashboardContent"

export default async function Dashboard() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    const sites = await prisma.site.findMany({
        where: { userId: session.user.id },
        include: {
            checks: {
                orderBy: { timestamp: "desc" },
                take: 10
            }
        }
    })

    return <DashboardContent initialSites={sites} user={session.user} />
}