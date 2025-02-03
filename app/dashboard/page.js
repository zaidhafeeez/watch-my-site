import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import AddSiteForm from "@/components/AddSiteForm"
import { calculateUptime } from "../utils/uptime"
import SiteCard from "@/components/SiteCard"

export default async function Dashboard() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    const sites = await prisma.site.findMany({
        where: { userId: session.user.id },
        include: {
            checks: {  // Must match schema relation name
                orderBy: { timestamp: "desc" },
                take: 10
            }
        }
    })

    const totalSites = sites.length;
    const upSites = sites.filter(site => site.status === 'up').length;
    const averageResponse = sites.reduce((acc, site) => acc + site.responseTime, 0) / totalSites || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400">Welcome back, {session.user.name}</p>
                        </div>
                        <div className="px-6 pb-6 md:py-6">
                            <AddSiteForm userId={session.user.id} />
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalSites}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sites Up</h3>
                        <p className="text-2xl font-semibold text-green-600">{upSites}/{totalSites}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</h3>
                        <p className="text-2xl font-semibold text-blue-600">{averageResponse.toFixed(0)}ms</p>
                    </div>
                </div>

                {/* Sites Grid */}
                {sites.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <p className="text-gray-500 mb-4">No sites being monitored yet</p>
                        <AddSiteForm userId={session.user.id} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map((site) => (
                            <SiteCard key={site.id} site={site} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}