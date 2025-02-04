/**
 * Calculate uptime percentage with weighted recent checks
 */
export function calculateUptime(site, options = {}) {
    const {
        recentWeight = 1.5, // Weight recent checks more heavily
        timeWindow = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    } = options

    if (!site.checks || site.checks.length === 0) {
        return site.totalChecks === 0 ? 100 : (site.successfulChecks / site.totalChecks) * 100
    }

    const now = new Date()
    const recentChecks = site.checks.filter(check => {
        const checkTime = new Date(check.timestamp)
        return now - checkTime <= timeWindow
    })

    if (recentChecks.length === 0) {
        return (site.successfulChecks / site.totalChecks) * 100
    }

    // Calculate weighted uptime
    const weightedSuccesses = recentChecks.reduce((acc, check, index) => {
        const isSuccess = check.status === 'up'
        const weight = index < recentChecks.length / 2 ? recentWeight : 1
        return acc + (isSuccess ? weight : 0)
    }, 0)

    const totalWeight = recentChecks.reduce((acc, _, index) => {
        return acc + (index < recentChecks.length / 2 ? recentWeight : 1)
    }, 0)

    return (weightedSuccesses / totalWeight) * 100
}

/**
 * Calculate average response time with trend
 */
export function calculateResponseMetrics(site) {
    if (!site.checks || site.checks.length === 0) {
        return {
            average: site.responseTime || 0,
            trend: 'stable',
            improvement: 0
        }
    }

    const recentChecks = site.checks.slice(0, 5)
    const olderChecks = site.checks.slice(5, 10)

    const recentAvg = recentChecks.reduce((acc, check) => acc + check.responseTime, 0) / recentChecks.length
    const olderAvg = olderChecks.length > 0
        ? olderChecks.reduce((acc, check) => acc + check.responseTime, 0) / olderChecks.length
        : recentAvg

    const improvement = olderAvg ? ((olderAvg - recentAvg) / olderAvg) * 100 : 0

    return {
        average: Math.round(recentAvg),
        trend: improvement > 5 ? 'improving' : improvement < -5 ? 'degrading' : 'stable',
        improvement: Math.round(improvement)
    }
}

/**
 * Get site health status with detailed metrics
 */
export function getSiteHealth(site) {
    // Consider site healthy if at least one check is up
    const isHealthy = site.checks?.some(check => check.status === 'up') ?? false;
    
    // Calculate uptime from all checks
    const uptime = site.totalChecks > 0
        ? (site.successfulChecks / site.totalChecks) * 100
        : 100;

    // Get recent checks and calculate response time
    const recentChecks = site.checks?.slice(0, 10) ?? [];
    const avgResponseTime = recentChecks.length > 0
        ? recentChecks.reduce((sum, check) => sum + check.responseTime, 0) / recentChecks.length
        : 0;

    return {
        status: isHealthy ? 'healthy' : 'down',
        uptime: Math.round(uptime * 100) / 100,
        responseTime: {
            average: Math.round(avgResponseTime),
            min: Math.min(...recentChecks.map(c => c.responseTime)),
            max: Math.max(...recentChecks.map(c => c.responseTime))
        },
        lastCheck: recentChecks[0]?.timestamp ?? null,
        error: recentChecks[0]?.error ?? null
    };
}

/**
 * Format duration from milliseconds
 */
export function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
}
