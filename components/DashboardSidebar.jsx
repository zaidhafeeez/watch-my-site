'use client'

export default function DashboardSidebar({ sites, selectedSiteId, onSiteSelect }) {
    return (
        <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Sites</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sites.length} sites monitored
                </p>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-10rem)]">
                {sites.map((site) => (
                    <button
                        key={site.id}
                        onClick={() => onSiteSelect(site.id)}
                        className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedSiteId === site.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {site.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {site.url}
                                </p>
                            </div>
                            <div className={`h-3 w-3 rounded-full ${
                                site.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
