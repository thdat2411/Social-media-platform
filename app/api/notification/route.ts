import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const filterSearch = url.searchParams.get('filter') || 'all'; // Default to 'all' if no filter is provided
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const take = 20; // Number of notifications per request
        const skip = (page - 1) * take; // Calculate how many notifications to skip

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let notifications;
        if (filterSearch === 'all') {
            notifications = await prisma.notification.findMany({
                where: { user_id: user.id },
                take,
                skip,
            });
        } else if (filterSearch === 'jobs') {
            notifications = await prisma.notification.findMany({
                where: { user_id: user.id, type: 'job' },
                take,
                skip,
            });
        } else if (filterSearch === 'my_posts') {
            notifications = await prisma.notification.findMany({
                where: { user_id: user.id, type: 'post' },
                take,
                skip,
            });
        } else {
            return NextResponse.json({ error: 'Invalid filter' }, { status: 400 });
        }

        return NextResponse.json({ notifications }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while fetching notifications' }, { status: 500 });
    }
}
