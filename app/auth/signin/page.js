'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (result.error) {
            setError(result.error)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}