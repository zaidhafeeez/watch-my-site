'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { validatePassword } from '@/lib/auth-utils'

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate password
            const { isValid, error } = validatePassword(formData.password)
            if (!isValid) {
                toast.error(error)
                return
            }

            // Check if passwords match
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match')
                return
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            toast.success('Account created successfully! Please check your email to verify your account.')
            router.push('/auth/signin')

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialSignIn = (provider) => {
        signIn(provider, { callbackUrl: '/dashboard' })
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>

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
            </div>

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
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-blue-600 hover:underline">
                    Sign in
                </a>
            </p>
        </div>
    )
}
