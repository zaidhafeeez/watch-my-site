// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
    const response = NextResponse.next()

    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')

    return response
}