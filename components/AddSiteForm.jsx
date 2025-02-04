'use client'

import { useState } from 'react'
import Modal from './ui/Modal'
import { toast } from 'sonner'

export default function AddSiteForm({ userId, onSiteAdded }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        url: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const optimisticId = Date.now().toString()
        const optimisticSite = {
            id: optimisticId,
            ...formData,
            userId,
            checks: []
        }

        // Optimistic update
        onSiteAdded(optimisticSite, optimisticId)
        
        try {
            const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add site')
            }

            // Update with actual data
            onSiteAdded(data)
            toast.success('Site added successfully')
            setIsOpen(false)
            setFormData({ name: '', url: '' })
        } catch (error) {
            toast.error(error.message)
            // Remove optimistic update
            onSiteAdded(null, optimisticId)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                         text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Site
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Site"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Site Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                                     bg-white dark:bg-gray-700 px-3 py-2
                                     text-gray-900 dark:text-white
                                     focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Site URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={formData.url}
                            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                                     bg-white dark:bg-gray-700 px-3 py-2
                                     text-gray-900 dark:text-white
                                     focus:border-blue-500 focus:ring-blue-500"
                            placeholder="https://"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                                     hover:text-gray-800 dark:hover:text-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent
                                     text-sm font-medium rounded-md text-white bg-blue-600
                                     hover:bg-blue-700 focus:outline-none focus:ring-2
                                     focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                    </div>
                </form>
            </Modal>
        </>
    )
}