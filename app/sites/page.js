'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SitesPage() {
    const [sites, setSites] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newSite, setNewSite] = useState({ name: '', url: '' })

    useEffect(() => {
        fetchSites()
    }, [])

    const fetchSites = async () => {
        try {
            const response = await fetch('/api/sites')
            const data = await response.json()
            setSites(data)
        } catch (error) {
            toast.error('Failed to fetch sites')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddSite = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSite)
            })

            if (!response.ok) throw new Error('Failed to add site')

            toast.success('Site added successfully')
            setShowAddModal(false)
            setNewSite({ name: '', url: '' })
            fetchSites()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteSite = async (siteId) => {
        if (!confirm('Are you sure you want to delete this site?')) return

        try {
            const response = await fetch(`/api/sites/${siteId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete site')

            toast.success('Site deleted successfully')
            fetchSites()
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Sites</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add New Site
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : sites.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No sites added yet</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-blue-600 hover:underline"
                    >
                        Add your first site
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sites.map(site => (
                        <div
                            key={site.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold">{site.name}</h3>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDeleteSite(site.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline mb-4 block"
                            >
                                {site.url}
                            </a>
                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    site.status === 'up' ? 'bg-green-100 text-green-800' :
                                    site.status === 'down' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {site.status.toUpperCase()}
                                </span>
                                <Link
                                    href={`/sites/${site.id}`}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Site Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Site</h2>
                        <form onSubmit={handleAddSite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={newSite.name}
                                    onChange={e => setNewSite(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Site URL</label>
                                <input
                                    type="url"
                                    value={newSite.url}
                                    onChange={e => setNewSite(prev => ({ ...prev, url: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {isLoading ? 'Adding...' : 'Add Site'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
