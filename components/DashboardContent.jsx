'use client'

import { useState } from 'react'
import AddSiteForm from "./AddSiteForm"
import DashboardSidebar from "./DashboardSidebar"
import SiteDetails from "./SiteDetails"
import SiteCard from "./SiteCard"
import { getSiteHealth } from "@/app/utils/monitoring"

export default function DashboardContent({ initialSites, user }) {
    const [sites, setSites] = useState(initialSites)
    const [selectedSiteId, setSelectedSiteId] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const selectedSite = sites.find(site => site.id === selectedSiteId)

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Stats Overview */}
            <div className="lg:hidden p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sites</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{totalSites}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Up</p>
                        <p className="text-xl font-semibold text-green-600">{healthyStats.upSites}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg</p>
                        <p className="text-xl font-semibold text-blue-600">{averageResponse.toFixed(0)}ms</p>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar with glass effect */}
                <div className={`
                    fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 
                    transition-all duration-300 ease-in-out
                    w-72 lg:w-96 z-30
                    bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl
                    border-r border-gray-200/50 dark:border-gray-700/50
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <DashboardSidebar
                        sites={sites}
                        selectedSiteId={selectedSiteId}
                        onSiteSelect={(siteId) => {
                            setSelectedSiteId(siteId)
                            setIsSidebarOpen(false)
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
                                <p className="text-gray-600 dark:text-gray-400">Monitor and manage your sites</p>
                            </div>
                            <AddSiteForm userId={user.id} onSiteAdded={handleSiteAdded} />
                        </div>
                        
                        {/* Desktop Stats */}
                        <div className="hidden lg:grid grid-cols-3 gap-6">
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{totalSites}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sites Up</h3>
                                <p className="text-2xl font-semibold text-green-600 mt-2">{healthyStats.upSites}/{totalSites}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</h3>
                                <p className="text-2xl font-semibold text-blue-600 mt-2">{averageResponse.toFixed(0)}ms</p>
                            </div>
                        </div>

                        <div className="transition-all duration-200 ease-in-out">
                            <SiteDetails 
                                site={selectedSite} 
                                onDelete={handleSiteDelete}  // Add this line
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Improved overlay with blur effect */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden transition-all duration-300 ease-in-out"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}
