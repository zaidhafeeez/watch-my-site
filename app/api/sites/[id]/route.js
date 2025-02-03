import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify site exists and belongs to user
        const site = await prisma.site.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!site) {
            return NextResponse.json(
                { error: 'Site not found' },
                { status: 404 }
            )
        }

        if (site.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete site and related checks in a transaction
        await prisma.$transaction([
            prisma.statusCheck.deleteMany({
                where: { siteId: id }
            }),
            prisma.site.delete({
                where: { id }
            })
        ])

        return NextResponse.json({
            message: 'Site deleted successfully'
        })

    } catch (error) {
        console.error('[SITE_DELETE] Error:', error)
        return NextResponse.json(
            { error: 'Failed to delete site' },
            { status: 500 }
        )
    }
}
