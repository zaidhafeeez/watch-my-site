import { NextResponse } from 'next/server'

export function middleware(request) {
    const response = NextResponse.next()

    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')

    return response
}