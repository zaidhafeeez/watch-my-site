/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        },
    },
}

export default nextConfig
