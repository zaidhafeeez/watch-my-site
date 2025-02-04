import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { performAdvancedHealthCheck } from "@/lib/services/healthCheck";
import { getNextCheckTime } from "@/lib/cronUtils";

export async function POST(req) {
    try {
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sites = await prisma.site.findMany({
            where: {
                OR: [
                    { nextCheckAt: null },
                    { nextCheckAt: { lte: new Date() } }
                ]
            },
            select: { id: true, url: true, name: true }
        });

        const results = await Promise.allSettled(
            sites.map(async (site) => {
                try {
                    const result = await performAdvancedHealthCheck(site);
                    const isUp = result.status === 'up';
                    
                    await prisma.$transaction([
                        prisma.statusCheck.create({
                            data: {
                                siteId: site.id,
                                status: isUp ? 'up' : 'down',
                                responseTime: result.responseTime,
                                statusCode: result.statusCode,
                                headers: result.headers || null,
                                sslInfo: result.ssl || null,
                                dnsInfo: result.dns || null,
                                error: result.error || null
                            }
                        }),
                        prisma.site.update({
                            where: { id: site.id },
                            data: {
                                status: isUp ? 'up' : 'down',
                                responseTime: result.responseTime,
                                totalChecks: { increment: 1 },
                                successfulChecks: isUp ? { increment: 1 } : undefined,
                                lastChecked: new Date(),
                                nextCheckAt: getNextCheckTime(5)
                            }
                        })
                    ]);

                    return { success: true, site: site.name, status: result.status };
                } catch (error) {
                    return { success: false, site: site.name, error: error.message };
                }
            })
        );

        // Update next check time
        await prisma.site.updateMany({
            where: {
                id: {
                    in: sites.map(site => site.id)
                }
            },
            data: {
                lastChecked: new Date(),
                nextCheckAt: getNextCheckTime()
            }
        });

        return NextResponse.json({
            success: true,
            checkedAt: new Date().toISOString(),
            results: results.map(r => r.value || r.reason)
        });

    } catch (error) {
        console.error('[BULK_CHECK] Error:', error);
        return NextResponse.json(
            { error: 'Failed to perform bulk check' },
            { status: 500 }
        );
    }
}
