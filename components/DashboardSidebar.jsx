'use client'

export default function DashboardSidebar({ sites, selectedSiteId, onSiteSelect }) {
    return (
        <div className="h-full flex flex-col">
            <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Your Sites
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {sites.length} sites monitored
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sites.map((site) => (
                    <button
                        key={site.id}
                        onClick={() => onSiteSelect(site.id)}
                        className={`w-full text-left p-6 rounded-xl transition-all duration-200 ease-in-out
                            ${selectedSiteId === site.id 
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'
                            }
                            border
                            group
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {site.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                    {site.url}
                                </p>
                            </div>
                            <div className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                site.status === 'up' 
                                ? 'bg-green-500 group-hover:ring-4 ring-green-500/20' 
                                : 'bg-red-500 group-hover:ring-4 ring-red-500/20'
                            }`} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
