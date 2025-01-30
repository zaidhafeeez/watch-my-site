import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    const { name, url } = await req.json();

    const site = await prisma.site.create({
        data: {
            name,
            url
        }
    });

    return NextResponse.json(site);
}

export async function GET() {
    const sites = await prisma.site.findMany();

    return NextResponse.json(sites);
}