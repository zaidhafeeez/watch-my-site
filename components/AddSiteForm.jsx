'use client'

import { toast } from 'sonner'
import { useState } from 'react'

export default function AddSiteForm({ userId }) {
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
            setName('')
            setUrl('')
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site URL
                </label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add Site
                </button>
            </div>
        </form>
    )
}