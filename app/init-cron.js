'use client'

import { useEffect } from 'react'

export default function CronInitializer() {
    useEffect(() => {
        // Initialize checks
        const runHealthChecks = async () => {
            try {
                const response = await fetch('/api/sites/check-all', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to run health checks');
                }

                const data = await response.json();
                console.log('[CRON] Health checks completed:', data.summary);
            } catch (error) {
                console.error('[CRON] Error:', error);
            }
        };

        // Run immediately on mount
        runHealthChecks();

        // Set up interval
        const intervalId = setInterval(runHealthChecks, 5 * 60 * 1000); // Every 5 minutes

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, []);

    return null;
}