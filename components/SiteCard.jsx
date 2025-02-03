'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { toast } from "sonner"
import { getSiteHealth } from "@/app/utils/monitoring"
import { getRelativeTimeString } from "@/app/utils/time"
import DeleteSiteButton from './DeleteSiteButton'

export default function SiteCard({ site, onDelete }) {
    const health = getSiteHealth(site)
    const [lastChecked, setLastChecked] = useState('just now')

    useEffect(() => {
        const updateTime = () => {
            setLastChecked(getRelativeTimeString(health.lastCheck))
        }
        
        updateTime()
        const interval = setInterval(updateTime, 1000)
        
        return () => clearInterval(interval)
    }, [health.lastCheck])

    const refreshSite = async (siteId) => {
        const toastId = toast.loading('Refreshing site status...')
        
        try {
            // Add your refresh logic here
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
            
            toast.dismiss(toastId)
            toast.success('Site status updated successfully')
        } catch (error) {
            toast.dismiss(toastId)
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
                        health.status === 'healthy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : health.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                        {health.status}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                        <span className="font-medium text-gray-900 dark:text-white">{health.uptime.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {health.responseTime.average}ms
                            </span>
                            {health.responseTime.trend !== 'stable' && (
                                <span className={`text-xs ${
                                    health.responseTime.trend === 'improving' 
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {health.responseTime.improvement}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Last Checked</span>
                        <span className="text-gray-500">
                            {lastChecked} ago
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/dashboard/${site.id}`}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                        >
                            View History →
                        </Link>
                        <DeleteSiteButton siteId={site.id} onDelete={onDelete} />
                    </div>
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
