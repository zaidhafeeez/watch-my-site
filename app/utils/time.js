export function getRelativeTimeString(timestamp) {
    const now = Date.now()
    const diff = now - new Date(timestamp).getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    const seconds = Math.floor(diff / 1000)

    if (hours > 23) {
        const days = Math.floor(hours / 24)
        return `${days}d`
    }
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
}
