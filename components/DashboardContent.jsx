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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center text-gray-500 hover:text-gray-600 dark:text-gray-400"
                >
                    <span className="mr-2">{isSidebarOpen ? 'Hide Sites' : 'Show Sites'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out
                    w-64 lg:w-80 z-30
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
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
                    <div className="p-6">
                        <div className="mb-6">
                            <AddSiteForm userId={user.id} onSiteAdded={handleSiteAdded} />
                        </div>
                        <SiteDetails site={selectedSite} />
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}
