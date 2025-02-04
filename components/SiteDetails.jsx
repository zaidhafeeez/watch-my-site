'use client'

import { getSiteHealth } from "@/app/utils/monitoring"

export default function SiteDetails({ site }) {
    if (!site) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Select a site to view details</p>
            </div>
        )
    }

    const health = getSiteHealth(site)

    return (
        <div className="h-full p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{site.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{site.url}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <p className={`text-2xl font-semibold ${health.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                        {health.status === 'healthy' ? 'Healthy' : 'Down'}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
                    <p className="text-2xl font-semibold text-blue-600">{health.uptime}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</h3>
                    <p className="text-2xl font-semibold text-blue-600">{health.responseTime.average}ms</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Checks</h2>
                    <div className="space-y-4">
                        {site.checks.map((check) => (
                            <div key={check.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(check.timestamp).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Response time: {check.responseTime}ms
                                    </p>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${
                                    check.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
