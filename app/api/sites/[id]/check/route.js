import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";
import { performAdvancedHealthCheck } from "@/lib/services/healthCheck";

export async function POST(request, context) {
    try {
        const session = await getServerSession(authOptions);
        const id = context.params.id; // Access id from context.params

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const site = await prisma.site.findUnique({
            where: { id },
            select: { url: true, userId: true }
        });

        if (!site || site.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const checkResult = await performAdvancedHealthCheck(site);

        const statusCheck = await prisma.statusCheck.create({
            data: {
                siteId: id,
                status: checkResult.status,
                responseTime: checkResult.responseTime,
                statusCode: checkResult.statusCode,
                headers: checkResult.headers,
                sslInfo: checkResult.ssl,
                dnsInfo: checkResult.dns,
                error: checkResult.error
            }
        });

        return NextResponse.json(statusCheck);

    } catch (error) {
        console.error('[HEALTH_CHECK] Error:', error);
        return NextResponse.json(
            { error: 'Failed to perform health check' },
            { status: 500 }
        );
    }
}