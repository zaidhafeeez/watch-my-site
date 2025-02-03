import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Optimize site verification with caching
        const site = await prisma.site.findUnique({
            where: { id },
            select: { userId: true },
            cacheStrategy: { ttl: 60 }
        })

        if (!site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 })
        }

        if (site.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Optimize deletion with a more efficient transaction
        await prisma.$transaction([
            // Delete checks first to reduce lock time
            prisma.statusCheck.deleteMany({
                where: { siteId: id }
            }),
            // Then delete the site
            prisma.site.delete({
                where: { id }
            })
        ], {
            timeout: 10000, // 10s timeout
            isolationLevel: 'ReadCommitted' // Less strict isolation for better performance
        })

        return NextResponse.json({ message: 'Site deleted successfully' })

    } catch (error) {
        console.error('[SITE_DELETE] Error:', error)
        return NextResponse.json(
            { error: 'Failed to delete site' },
            { status: 500 }
        )
    }
}
