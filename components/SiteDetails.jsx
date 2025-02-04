'use client'

import { useState } from 'react'
import { getSiteHealth } from "@/app/utils/monitoring"
import DeleteSiteButton from './DeleteSiteButton'

export default function SiteDetails({ site, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    if (!site) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a site</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    Choose a site from the sidebar to view detailed monitoring information
                </p>
            </div>
        )
    }

    const health = getSiteHealth(site)

    return (
        <div className="space-y-8 animate-fadeIn pr-6">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{site.name}</h1>
                        <a href={site.url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            {site.url}
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-full ${
                            health.status === 'healthy' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                            {health.status === 'healthy' ? 'Operational' : 'Down'}
                        </div>
                        
                        {/* Three Dots Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1 border border-gray-200 dark:border-gray-700">
                                        <DeleteSiteButton
                                            siteId={site.id}
                                            onDelete={onDelete}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 dark:text-red-400"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/70 dark:bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                health.uptime >= 99 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                                Last 30 days
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                            {health.uptime}%
                        </p>
                    </div>
                    
                    {/* Response Time Card */}
                    <div className="bg-white/70 dark:bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</h3>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Average
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                            {health.responseTime.average}ms
                        </p>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white/70 dark:bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                health.status === 'healthy'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                Current
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className={`h-3 w-3 rounded-full ${
                                health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {health.status === 'healthy' ? 'Healthy' : 'Down'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Checks Section */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Checks</h2>
                    <div className="space-y-4">
                        {site.checks.map((check) => (
                            <div key={check.id} 
                                 className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/30 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div>
                                    <p className="text-gray-900 dark:text-white font-medium">
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

            {/* Historical Uptime Graphs */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historical Uptime</h2>
                    {/* Add your graph component here */}
                </div>
            </div>

            {/* Response Time Charts */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time</h2>
                    {/* Add your chart component here */}
                </div>
            </div>

            {/* Incident Timeline */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incident Timeline</h2>
                    {/* Add your timeline component here */}
                </div>
            </div>

            {/* Site Configuration Panel */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Configuration</h2>
                    {/* Add your configuration panel component here */}
                </div>
            </div>

            {/* SSL Certificate Info */}
            {site.checks[0]?.sslInfo && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">SSL Certificate</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className={site.checks[0].sslInfo.valid ? 'text-green-500' : 'text-red-500'}>
                                {site.checks[0].sslInfo.valid ? 'Valid' : 'Invalid'}
                            </span>
                        </div>
                        {site.checks[0].sslInfo.grade && (
                            <div className="flex justify-between">
                                <span>SSL Grade</span>
                                <span>{site.checks[0].sslInfo.grade}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DNS Records Viewer */}
            {site.checks[0]?.dnsInfo && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">DNS Records</h2>
                    <div className="space-y-2">
                        {site.checks[0].dnsInfo.records?.map((record, i) => (
                            <div key={i} className="flex justify-between">
                                <span>A Record</span>
                                <span>{record}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
