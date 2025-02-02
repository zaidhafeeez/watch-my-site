'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Watch My Site</Link>
                <div>
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                Hi, {session.user?.name || session.user?.email || 'User'}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}