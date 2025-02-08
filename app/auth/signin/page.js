'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [remember, setRemember] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                remember
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Successfully signed in!')
                router.push(callbackUrl)
            }
        } catch (error) {
            toast.error('An error occurred during sign in')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialSignIn = (provider) => {
        signIn(provider, { callbackUrl })
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

            <div className="space-y-4 mb-6">
                <button
                    onClick={() => handleSocialSignIn('google')}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50"
                >
                    <Image src="/google.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                    Continue with Google
                </button>
                <button
                    onClick={() => handleSocialSignIn('github')}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800"
                >
                    <Image src="/github.svg" alt="GitHub" width={20} height={20} className="w-5 h-5" />
                    Continue with GitHub
                </button>
            </div >

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm">Remember me</span>
                    </label>
                    <a href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up
                </a>
            </p>
        </div >
    )
}