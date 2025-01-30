export const calculateUptime = (site) => {
    if (site.totalChecks === 0) return 0
    return (site.successfulChecks / site.totalChecks) * 100
}