'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function AddSiteForm({ userId, onSiteAdded }) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Create optimistic site
        const optimisticSite = {
            id: `temp-${Date.now()}`,
            name: name.trim(),
            url: url.trim(),
            status: 'checking',
            successfulChecks: 0,
            totalChecks: 0,
            responseTime: 0,
            userId,
            checks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        // Optimistic update
        onSiteAdded?.(optimisticSite)
        
        try {
            const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, url })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add site')
            }

            // Update with real data
            onSiteAdded?.(data.site)
            toast.success(data.message || 'Site added successfully')
            
            // Reset form
            setName('')
            setUrl('')
        } catch (error) {
            toast.error(error.message)
            // Remove optimistic site on error
            onSiteAdded?.(null, optimisticSite.id)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="inline-flex">
            <form onSubmit={handleSubmit} className="flex items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Site Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="My Website"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Site URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://example.com"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 flex items-center"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                        </>
                    ) : (
                        'Add Site'
                    )}
                </button>
            </form>
        </div>
    )
}