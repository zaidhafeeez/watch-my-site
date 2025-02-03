'use client'

import { toast } from 'sonner'
import { useState } from 'react'

export default function AddSiteForm({ userId, onSiteAdded }) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const toastId = toast.loading('Adding site...')
        
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

            toast.dismiss(toastId)
            toast.success(data.message || 'Site added successfully')
            onSiteAdded?.(data.site)
            setName('')
            setUrl('')
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error.message)
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
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    Add Site
                </button>
            </form>
        </div>
    )
}