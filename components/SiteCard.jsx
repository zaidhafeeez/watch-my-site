'use client'

import Link from "next/link"
import { calculateUptime } from "@/app/utils/uptime"
import { toast } from "sonner"

export default function SiteCard({ site }) {
    const uptime = calculateUptime(site)

    const refreshSite = async (siteId) => {
        try {
            toast.loading('Refreshing site status...')
            // Add your refresh logic here
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
            toast.success('Site status updated successfully')
        } catch (error) {
            toast.error('Failed to refresh site status')
        }
    }

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
