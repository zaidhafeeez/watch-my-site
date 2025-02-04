
'use client'

import { User, Site } from '@/lib/types'
import { Button } from './ui/button'
import AddSiteForm from './AddSiteForm'

interface DashboardHeaderProps {
    user: User;
    stats: {
        totalSites: number;
        upSites: number;
        averageResponse: number;
    };
    onSiteAdded: (site: Site, optimisticId?: string | null) => void;
}

export default function DashboardHeader({ user, stats, onSiteAdded }: DashboardHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="max-w-[2000px] mx-auto px-6">
                <div className="h-24 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your sites</p>
                    </div>
                    <AddSiteForm userId={user.id} onSiteAdded={onSiteAdded} />
                </div>

                {/* Stats Grid with fixed height */}
                <div className="h-28 grid grid-cols-1 md:grid-cols-3 gap-6 -mb-4">
                    {/* Total Sites */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 transition-all hover:scale-[1.02] duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
                            <span className="flex h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4m-9 4v10m-9-4l9 4 9-4" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{stats.totalSites}</p>
                    </div>

                    {/* Sites Up */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 transition-all hover:scale-[1.02] duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sites Up</h3>
                            <span className="flex h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-green-600 mt-2">{stats.upSites}/{stats.totalSites}</p>
                    </div>

                    {/* Response Time */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 transition-all hover:scale-[1.02] duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</h3>
                            <span className="flex h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-blue-600 mt-2">{stats.averageResponse.toFixed(0)}ms</p>
                    </div>
                </div>
            </div>
        </div>
    )
}