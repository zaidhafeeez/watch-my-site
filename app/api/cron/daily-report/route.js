import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateUptime } from "@/app/utils/monitoring";

export async function POST(req) {
    try {
        if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const sites = await prisma.site.findMany({
            include: {
                checks: {
                    where: { timestamp: { gte: yesterday } },
                    orderBy: { timestamp: 'desc' }
                },
                user: {
                    select: { email: true }
                }
            }
        });

        const reports = sites.map(site => ({
            siteName: site.name,
            url: site.url,
            uptime: calculateUptime(site, { timeWindow: 24 * 60 * 60 * 1000 }),
            totalChecks: site.checks.length,
            successfulChecks: site.checks.filter(check => check.status === 'up').length,
            averageResponseTime: site.checks.reduce((acc, check) => acc + check.responseTime, 0) / site.checks.length || 0
        }));

        // Store reports in database and/or send emails
        // You'll need to implement email sending logic here

        return NextResponse.json({
            success: true,
            reportsGenerated: reports.length
        });

    } catch (error) {
        console.error('[DAILY_REPORT] Error:', error);
        return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 });
    }
}
