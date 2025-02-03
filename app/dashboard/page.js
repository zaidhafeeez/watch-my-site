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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Your Monitored Sites</h1>
                <AddSiteForm userId={session.user.id} />
            </div>

            {sites.length === 0 ? (
                <div className="text-center py-12">
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
    )
}

function SiteCard({ site }) {
    const uptime = calculateUptime(site)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="font-semibold text-lg">{site.name}</h2>
                    <p className="text-gray-500 text-sm break-all">{site.url}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${site.status === 'up' ? 'bg-green-100 text-green-800' :
                    site.status === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                    }`}>
                    {site.status}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{uptime.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-medium">{site.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                    <span>Last Checked:</span>
                    <span className="text-gray-500">
                        {new Date(site.updatedAt).toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <Link
                    href={`/dashboard/${site.id}`}
                    className="text-blue-600 hover:underline text-sm"
                >
                    View History
                </Link>
                <button
                    onClick={() => refreshSite(site.id)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                >
                    Refresh
                </button>
            </div>
        </div>
    )
}