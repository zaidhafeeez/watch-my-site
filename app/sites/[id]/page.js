'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function SiteDetails() {
    const { id } = useParams()
    const [site, setSite] = useState(null)
    const [checks, setChecks] = useState([])
    const [stats, setStats] = useState({
        uptime: 0,
        avgResponseTime: 0,
        totalChecks: 0,
        successfulChecks: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('24h') // 24h, 7d, 30d

    useEffect(() => {
        fetchSiteDetails()
        fetchChecks()
    }, [id, timeRange])

    const fetchSiteDetails = async () => {
        try {
            const response = await fetch(`/api/sites/${id}`)
            const data = await response.json()
            if (response.ok) {
                setSite(data)
                calculateStats(data)
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            toast.error('Failed to fetch site details')
        }
    }

    const fetchChecks = async () => {
        try {
            const response = await fetch(`/api/sites/${id}/checks?timeRange=${timeRange}`)
            const data = await response.json()
            if (response.ok) {
                setChecks(data)
            }
        } catch (error) {
            toast.error('Failed to fetch status checks')
        } finally {
            setIsLoading(false)
        }
    }

    const calculateStats = (siteData) => {
        if (!siteData) return
        const uptime = (siteData.successfulChecks / siteData.totalChecks) * 100
        setStats({
            uptime: uptime.toFixed(2),
            avgResponseTime: siteData.responseTime,
            totalChecks: siteData.totalChecks,
            successfulChecks: siteData.successfulChecks
        })
    }

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!site) {
        return <div className="text-center py-12">Site not found</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Site Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
                        <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {site.url}
                        </a>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        site.status === 'up' ? 'bg-green-100 text-green-800' :
                        site.status === 'down' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {site.status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Uptime</h3>
                    <p className="text-2xl font-bold">{stats.uptime}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Avg. Response Time</h3>
                    <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Checks</h3>
                    <p className="text-2xl font-bold">{stats.totalChecks}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Successful Checks</h3>
                    <p className="text-2xl font-bold">{stats.successfulChecks}</p>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-end mb-6">
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>
            </div>

            {/* Status Checks List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Checks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="text-left py-3 px-4">Timestamp</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Response Time</th>
                                    <th className="text-left py-3 px-4">Status Code</th>
                                    <th className="text-left py-3 px-4">Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checks.map((check) => (
                                    <tr key={check.id} className="border-b dark:border-gray-700">
                                        <td className="py-3 px-4">
                                            {new Date(check.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                check.status === 'up' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {check.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{check.responseTime}ms</td>
                                        <td className="py-3 px-4">{check.statusCode}</td>
                                        <td className="py-3 px-4 text-red-600">{check.error || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
