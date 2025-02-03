'use client'

import { useState } from 'react'
import AddSiteForm from "./AddSiteForm"
import SiteCard from "./SiteCard"
import { getSiteHealth } from "@/app/utils/monitoring"

export default function DashboardContent({ initialSites, user }) {
    const [sites, setSites] = useState(initialSites)

    const totalSites = sites.length
    const healthyStats = sites.reduce((acc, site) => {
        const health = getSiteHealth(site)
        return {
            upSites: acc.upSites + (health.status === 'healthy' ? 1 : 0),
            totalResponseTime: acc.totalResponseTime + health.responseTime.average
        }
    }, { upSites: 0, totalResponseTime: 0 })

    const averageResponse = totalSites ? healthyStats.totalResponseTime / totalSites : 0

    const handleSiteDelete = (deletedSiteId) => {
        const updatedSites = sites.filter(site => site.id !== deletedSiteId)
        setSites(updatedSites)
    }

    const handleSiteAdded = (newSite, optimisticId = null) => {
        if (!newSite && optimisticId) {
            // Remove optimistic site on error
            setSites(prev => prev.filter(site => site.id !== optimisticId))
            return
        }

        setSites(prev => {
            // Remove optimistic site if it exists
            const filtered = prev.filter(site => site.id !== optimisticId)
            return [...filtered, newSite]
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
                        </div>
                        <div className="px-6 pb-6 md:py-6">
                            <AddSiteForm userId={user.id} onSiteAdded={handleSiteAdded} />
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
                        <p className="text-2xl font-semibold text-green-600">{healthyStats.upSites}/{totalSites}</p>
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
                        <AddSiteForm userId={user.id} onSiteAdded={(newSite) => setSites([newSite])} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map((site) => (
                            <SiteCard 
                                key={site.id} 
                                site={site} 
                                onDelete={handleSiteDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
