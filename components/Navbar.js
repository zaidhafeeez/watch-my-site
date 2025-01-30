import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Status Monitor
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a
                            href="https://github.com/yourusername/website-monitor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}