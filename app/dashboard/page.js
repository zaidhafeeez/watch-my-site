import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import AddSiteForm from "@/components/AddSiteForm"

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
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="text-gray-500">Welcome back, {session.user.name}</p>
                        </div>
                        <AddSiteForm userId={session.user.id} />
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

function SiteCard({ site }) {
    const uptime = calculateUptime(site)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{site.name}</h2>
                        <p className="text-gray-500 text-sm break-all">{site.url}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        site.status === 'up' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : site.status === 'down' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                        {site.status}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                        <span className="font-medium text-gray-900 dark:text-white">{uptime.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <span className="font-medium text-gray-900 dark:text-white">{site.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Last Checked</span>
                        <span className="text-gray-500">
                            {new Date(site.updatedAt).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link
                        href={`/dashboard/${site.id}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                        View History →
                    </Link>
                    <button
                        onClick={() => refreshSite(site.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    )
}