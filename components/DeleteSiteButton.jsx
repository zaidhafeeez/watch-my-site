'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteSiteButton({ siteId, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        const toastId = toast.loading('Deleting site...')
        setIsDeleting(true)

        try {
            const response = await fetch(`/api/sites/${siteId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete site')
            }

            toast.dismiss(toastId)
            toast.success('Site deleted successfully')
            onDelete && onDelete(siteId)
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error.message)
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
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        Delete
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
