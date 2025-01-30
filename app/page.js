'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { calculateUptime } from './utils/uptime'

export default function Home() {
  const [sites, setSites] = useState([])
  const [newSite, setNewSite] = useState({ name: '', url: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    const response = await axios.get('/api/sites')
    setSites(response.data)
  }

  const addSite = async (e) => {
    e.preventDefault()
    try {
      // Trim and validate inputs
      const trimmedName = newSite.name.trim()
      const trimmedUrl = newSite.url.trim()

      if (!trimmedName || !trimmedUrl) {
        alert('Please fill in both name and URL fields')
        return
      }

      // Basic URL validation
      try {
        new URL(trimmedUrl)
      } catch {
        alert('Please enter a valid URL (include http:// or https://)')
        return
      }

      const response = await axios.post('/api/sites', {
        name: trimmedName,
        url: trimmedUrl
      })

      if (response.data.id) {
        try {
          await axios.post('/api/check-status', { id: response.data.id })
        } catch (checkError) {
          console.error('Initial check failed:', checkError)
        }
        await fetchSites()
      }

    } catch (error) {
      console.error('Add site error:', error)
      const errorMessage = error.response?.data?.error || error.message
      alert(`Failed to add site: ${errorMessage}`)
    } finally {
      setNewSite({ name: '', url: '' })
    }
  }

  const checkStatus = async (id) => {
    setLoading(true)
    try {
      await axios.post('/api/check-status', { id })
      await fetchSites()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Website Monitor</h1>

      <form onSubmit={addSite} className="mb-8">
        <input
          type="text"
          placeholder="Site name"
          className="border p-2 mr-2"
          value={newSite.name}
          onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
        />
        <input
          type="url"
          placeholder="https://example.com"
          className="border p-2 mr-2"
          value={newSite.url}
          onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Site
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <div key={site.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{site.name}</h2>
            <p className="mb-2">{site.url}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded ${site.status === 'up' ? 'bg-green-500' :
                  site.status === 'down' ? 'bg-red-500' :
                    'bg-gray-500'
                } text-white`}>
                {site.status}
              </span>
              <button
                onClick={() => checkStatus(site.id)}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>
            <p className="mt-2">Response Time: {site.responseTime || 0}ms</p>
            <p>Uptime: {calculateUptime(site).toFixed(2)}%</p>
            <p className="text-sm text-gray-500">
              Checks: {site.totalChecks || 0} (Successful: {site.successfulChecks || 0})
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}