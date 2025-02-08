'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { validatePassword } from '@/lib/auth-utils'

export default function ProfileSettings() {
    const { data: session, update } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email
                })
            })

            if (!response.ok) throw new Error('Failed to update profile')
            
            await update({ name: profileData.name, email: profileData.email })
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (profileData.newPassword !== profileData.confirmPassword) {
                throw new Error('New passwords do not match')
            }

            const { isValid, error } = validatePassword(profileData.newPassword)
            if (!isValid) {
                throw new Error(error)
            }

            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: profileData.currentPassword,
                    newPassword: profileData.newPassword
                })
            })

            if (!response.ok) throw new Error('Failed to update password')
            
            setProfileData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }))
            toast.success('Password updated successfully')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Password</label>
                            <input
                                type="password"
                                value={profileData.currentPassword}
                                onChange={e => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                value={profileData.newPassword}
                                onChange={e => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={profileData.confirmPassword}
                                onChange={e => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {isLoading ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
