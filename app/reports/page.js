'use client'

export default function ReportsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Reports</h1>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="ml-3 text-sm text-yellow-700 dark:text-yellow-200">
                            TODO: Reports feature is under development. Check back soon!
                        </p>
                    </div>
                    <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-300">
                        <p>Planned features:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>Uptime statistics</li>
                            <li>Response time analytics</li>
                            <li>Incident history</li>
                            <li>Performance trends</li>
                            <li>Custom date range filters</li>
                            <li>Export capabilities</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}