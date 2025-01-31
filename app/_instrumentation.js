export function register() {
    if (process.env.NEXT_RUNTIME === 'edge') {
        const { metrics } = require('@vercel/edge')
        metrics({
            rsc: true,
            middleware: true,
        })
    }
}