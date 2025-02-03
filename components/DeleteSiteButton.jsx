'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteSiteButton({ siteId, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        
        // Optimistic UI update
        onDelete && onDelete(siteId)

        try {
            const response = await fetch(`/api/sites/${siteId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete site')
            }

            toast.success('Site deleted successfully')
        } catch (error) {
            // Revert optimistic update on error
            toast.error(error.message)
            // You might want to implement a revert callback here
        } finally {
            setIsDeleting(false)
        }
    }

    const confirmDelete = () => {
        toast.custom((t) => (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to delete this site? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t)
                            handleDelete()
                        }}
                        disabled={isDeleting}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        ), { duration: 5000 })
    }

    return (
        <button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50"
        >
            Delete
        </button>
    )
}
