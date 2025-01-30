'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { calculateUptime } from './utils/uptime'

export default function Home() {
  const [sites, setSites] = useState([])
  const [newSite, setNewSite] = useState({ name: '', url: '' })
  const [checkingId, setCheckingId] = useState(null)

  useEffect(() => { fetchSites() }, [])

  const fetchSites = async () => {
    const { data } = await axios.get('/api/sites')
    setSites(data)
  }

  const addSite = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/sites', newSite)
      await axios.post('/api/check-status', { id: data.id })
      fetchSites()
      setNewSite({ name: '', url: '' })
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const checkStatus = async (id) => {
    setCheckingId(id)
    try {
      await axios.post('/api/check-status', { id })
      await fetchSites()
    } finally {
      setCheckingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Website Monitor</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Site Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={addSite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  placeholder="Google"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://google.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newSite.url}
                  onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Website
            </button>
          </form>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Site Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{site.name}</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                    ${site.status === 'up' ? 'bg-green-100 text-green-800' :
                      site.status === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {site.status === 'up' ? (
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {site.status}
                  </span>
                </div>

                {/* Site Details */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="truncate">{site.url}</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500">Response Time</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {site.responseTime || 0}ms
                      </dd>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {calculateUptime(site).toFixed(2)}%
                      </dd>
                    </div>
                  </div>

                  {/* Checks */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Checks: {site.totalChecks}</span>
                    <span className="text-green-600">{site.successfulChecks} successful</span>
                  </div>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => checkStatus(site.id)}
                  disabled={checkingId === site.id}
                  className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {checkingId === site.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    'Check Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}