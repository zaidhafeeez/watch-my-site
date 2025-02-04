export function getNextCheckTime(interval = 5) {
    const now = new Date();
    const next = new Date();
    next.setMinutes(now.getMinutes() + interval);
    return next;
}

export function shouldRunCheck(lastCheckTime, interval = 5) {
    if (!lastCheckTime) return true;
    
    const now = new Date();
    const last = new Date(lastCheckTime);
    const diffInMinutes = (now - last) / 1000 / 60;
    
    return diffInMinutes >= interval;
}
