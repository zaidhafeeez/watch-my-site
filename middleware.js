import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
    // Check if the request is for an API route
    if (request.nextUrl.pathname.startsWith('/api/user')) {
        const token = await getToken({ req: request })

        // Return unauthorized if no token exists
        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/user/:path*'
    ]
}