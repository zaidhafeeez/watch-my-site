'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Watch My Site</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <span className="text-blue-600 dark:text-blue-300 font-medium">
                                                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {session.user?.name || session.user?.email?.split('@')[0]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <div className="px-3 py-2 flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-300 font-medium">
                                            {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {session.user?.name || session.user?.email?.split('@')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}