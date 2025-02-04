'use client'

import { useState } from 'react'
import DashboardHeader from './DashboardHeader'
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

    const stats = {
        totalSites,
        upSites: healthyStats.upSites,
        averageResponse
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Dashboard Header */}
            <DashboardHeader 
                user={user}
                stats={stats}
                onSiteAdded={handleSiteAdded}
            />

            {/* Main Content - adjusted height calculation */}
            <div className="flex h-[calc(100vh-13rem)] max-w-[2000px] mx-auto px-6 pt-6">
                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 
                    transition-all duration-300 ease-in-out
                    w-72 lg:w-96 z-10
                    bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl
                    border-r border-gray-200/50 dark:border-gray-700/50
                    mt-0 pt-0
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

                {/* Content Area */}
                <div className="flex-1 overflow-auto py-6 pl-6 pr-0 mr-6">
                    <SiteDetails 
                        site={selectedSite} 
                        onDelete={handleSiteDelete}
                    />
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden transition-all duration-300 ease-in-out"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}
