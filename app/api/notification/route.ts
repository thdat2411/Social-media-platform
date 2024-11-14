import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const filterSearch = url.searchParams.get('filter') || 'all';
        const page = parseInt(url.searchParams.get('page') || '1');
        const take = 20;
        const skip = (page - 1) * take;

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let notifications;

        if (user.role === "jobseeker") {
            if (filterSearch === 'all') {
                notifications = await prisma.notification.findMany({
                    where: {
                        user_id: { not: user.id },
                        type: { not: "job_apply" }
                    },
                    take,
                    skip,
                    include: {
                        user: true,
                    },
                });
            } else if (filterSearch === 'jobs') {
                notifications = await prisma.notification.findMany({
                    where: { user_id: { not: user.id }, type: 'job_posting' },
                    take,
                    skip,
                    include: {
                        user: true,
                    },
                });
            } else if (filterSearch === 'my posts') {
                notifications = await prisma.notification.findMany({
                    where: { user_id: { not: user.id }, type: 'post' },
                    take,
                    skip,
                    include: {
                        user: true,
                    },
                });
            } else {
                return NextResponse.json({ error: 'Invalid filter' }, { status: 400 });
            }
        } else {
            if (filterSearch === 'all') {
                notifications = await prisma.notification.findMany({
                    where: {
                        OR: [
                            { user_id: user.id, type: "job_apply" },
                            { user_id: { not: user.id }, type: { not: "job_apply" } }
                        ],
                    },
                    take,
                    skip,
                    include: {
                        user: true, // Include related user data
                    },
                })
            } else if (filterSearch === 'jobs') {
                notifications = await prisma.notification.findMany({
                    where: {
                        OR: [
                            { user_id: user.id, type: "job_apply" },
                            { user_id: { not: user.id }, type: "job_posting" }
                        ],
                    },
                    take,
                    skip,
                    include: {
                        user: true,
                    },
                });
            } else if (filterSearch === 'my posts') {
                notifications = await prisma.notification.findMany({
                    where: { user_id: { not: user.id }, type: 'post' },
                    take,
                    skip,
                    include: {
                        user: true,
                    },
                });
            } else {
                return NextResponse.json({ error: 'Invalid filter' }, { status: 400 });
            }
        }

        return NextResponse.json({ notifications }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while fetching notifications' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { notificationId } = body;
        if (!notificationId) {
            return NextResponse.json({ error: 'Missing info' }, { status: 400 });
        }
        const notification = await prisma.notification.delete({
            where: { id: notificationId },
        });
        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }
        return NextResponse.json({ message: "Delete sucessfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while deleting notification' }, { status: 500 });
    }
}
