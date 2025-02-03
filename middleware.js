import { NextResponse } from 'next/server'

export const config = {
    matcher: '/',
}

export function middleware(request) {
    const response = NextResponse.next()

    // Cache assets for 1 hour
    response.headers.set('Cache-Control', 'public, s-maxage=3600')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')

    return response
}