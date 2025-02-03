export function calculateUptime(site) {
    if (site.totalChecks === 0) return 100
    return (site.successfulChecks / site.totalChecks) * 100
}