import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse as parseUrl } from 'url';
import { connect } from 'tls';

export async function POST(req) {
    try {
        if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sites = await prisma.site.findMany({
            select: { id: true, url: true }
        });

        const results = await Promise.allSettled(
            sites.map(async site => {
                try {
                    const { hostname } = parseUrl(site.url);
                    const cert = await new Promise((resolve, reject) => {
                        const socket = connect(443, hostname, { servername: hostname }, () => {
                            const cert = socket.getPeerCertificate();
                            socket.end();
                            resolve(cert);
                        });
                        socket.on('error', reject);
                    });

                    await prisma.site.update({
                        where: { id: site.id },
                        data: {
                            checks: {
                                create: {
                                    status: 'up',
                                    responseTime: 0,
                                    sslInfo: {
                                        valid: true,
                                        expiresAt: cert.valid_to,
                                        issuer: cert.issuer.CN,
                                        daysUntilExpiry: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
                                    }
                                }
                            }
                        }
                    });

                    return { success: true, site: hostname, expiresAt: cert.valid_to };
                } catch (error) {
                    return { success: false, site: hostname, error: error.message };
                }
            })
        );

        return NextResponse.json({
            success: true,
            results: results.map(r => r.value || r.reason)
        });

    } catch (error) {
        console.error('[SSL_CHECK] Error:', error);
        return NextResponse.json({ error: 'SSL check failed' }, { status: 500 });
    }
}
