'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddSiteForm({ userId }) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, url, userId })
            })

            if (response.ok) {
                router.refresh()
                setName('')
                setUrl('')
            }
        } catch (error) {
            console.error('Failed to add site:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-4">
            <input
                type="text"
                placeholder="Site Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border rounded"
                required
            />
            <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-4 py-2 border rounded"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Adding...' : 'Add Site'}
            </button>
        </form>
    )
}