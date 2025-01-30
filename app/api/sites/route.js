import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateUptime } from "@/app/utils/uptime";

const prisma = new PrismaClient();

export async function POST(req) {
    const { name, url } = await req.json()
    const site = await prisma.site.create({
        data: {
            name,
            url,
            status: 'checking', // Initial status
            successfulChecks: 0,
            totalChecks: 0
        }
    })

    return NextResponse.json(site)
}

export async function GET() {
    const sites = await prisma.site.findMany()
    const sitesWithUptime = sites.map(site => ({
        ...site,
        uptime: calculateUptime(site)
    }))

    return NextResponse.json(sitesWithUptime)
}