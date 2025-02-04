
export interface Site {
    id: string;
    name: string;
    url: string;
    userId: string;
    checks: Check[];
}

export interface Check {
    id: string;
    siteId: string;
    status: 'up' | 'down';
    responseTime: number;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface SiteHealth {
    status: 'healthy' | 'down';
    uptime: number;
    responseTime: {
        average: number;
        min: number;
        max: number;
    };
}