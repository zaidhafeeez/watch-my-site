'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Watch My Site</Link>
                <div>
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span>Hi, {session.user.name}</span>
                            <button
                                onClick={() => signOut()}
                                className="bg-gray-200 px-3 py-1 rounded"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}