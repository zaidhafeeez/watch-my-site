
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get sites that haven't been checked in the last minute
        const sites = await prisma.site.findMany({
            where: {
                OR: [
                    { lastChecked: null },
                    { lastChecked: { lt: new Date(Date.now() - 60000) } }
                ]
            },
            select: { id: true, url: true }
        });

        const results = await Promise.allSettled(
            sites.map(async site => {
                const startTime = Date.now();
                try {
                    const response = await fetch(site.url, {
                        method: 'HEAD',
                        timeout: 5000
                    });

                    const responseTime = Date.now() - startTime;
                    const isUp = response.ok;

                    await prisma.site.update({
                        where: { id: site.id },
                        data: {
                            lastChecked: new Date(),
                            responseTime,
                            status: isUp ? 'up' : 'down'
                        }
                    });

                    return { success: true, site: site.url, responseTime };
                } catch (error) {
                    return { success: false, site: site.url, error: error.message };
                }
            })
        );

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            results: results.map(r => r.value || r.reason)
        });

    } catch (error) {
        console.error('[PING] Error:', error);
        return NextResponse.json({ error: 'Ping check failed' }, { status: 500 });
    }
}