'use client'

import AddSiteForm from "./AddSiteForm"

export default function DashboardHeader({ user, stats, onSiteAdded }) {
    return (
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="max-w-full px-4 py-4">
                {/* Welcome and Add Site Section */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your sites</p>
                    </div>
                    <AddSiteForm userId={user.id} onSiteAdded={onSiteAdded} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSites}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sites Up</h3>
                        <p className="text-2xl font-semibold text-green-600">{stats.upSites}/{stats.totalSites}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</h3>
                        <p className="text-2xl font-semibold text-blue-600">{stats.averageResponse.toFixed(0)}ms</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
