import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const filterSearch = url.searchParams.get('filter') || 'all';
        const page = parseInt(url.searchParams.get('page') || '1');
        const take = 15;
        const skip = (page - 1) * take;

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let notifications;

        if (user.role === "jobseeker" || user.role === null) {
            notifications = await prisma.notification.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { user_id: { not: user.id }, type: { not: "job_apply" } },
                                { user_id: user.id, type: "post_comment" }
                            ]
                        },
                        {
                            OR: [
                                { type: "job_posting_update", job_posting: { job_applications: { some: { user_id: user.id } } } },
                                { type: { not: "job_posting_update" } }
                            ]
                        }
                    ],
                    created_at: { gt: user.created_at ?? new Date(0) }
                },
                take,
                skip,
                include: {
                    user: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
            if (filterSearch === 'jobs') {
                notifications = notifications.filter((notification) => notification.type.includes('job'));
            } else if (filterSearch === 'my posts') {
                notifications = notifications.filter((notification) => notification.type.includes('post_comment'));
            }
        } else {
            notifications = await prisma.notification.findMany({
                where: {
                    OR: [
                        { user_id: user.id, type: "job_apply" },
                        { user_id: user.id, type: { not: { contains: "job_posting" } } },
                        { user_id: user.id, type: "post_comment" }
                    ]
                },
                take,
                skip,
                include: {
                    user: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
            })
            if (filterSearch === 'jobs') {
                notifications = notifications.filter((notification) => notification.type.includes('job'));
            } else if (filterSearch === 'my posts') {
                notifications = notifications.filter((notification) => notification.type.includes('post_comment'));
            }
        }

        return NextResponse.json({ notifications }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while fetching notifications' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const body = await req.json();
    const { message, type, userId } = body;
    if (!message || !type || !userId) {
        return NextResponse.json({ error: 'Missing info' }, { status: 400 });
    }
    try {
        const notification = await prisma.notification.create({
            data: {
                user_id: userId,
                type,
                content: message,
            },
        });
        if (!notification) {
            return NextResponse.json({ error: 'Notification not created' }, { status: 404 });
        }
        return NextResponse.json({ notification }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while sending notification' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    try {
        const url = new URL(req.url);
        const notificationId = url.searchParams.get('notificationId');
        if (!notificationId) {
            return NextResponse.json({ error: 'Missing info' }, { status: 400 });
        }
        const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: {
                is_read: true,
            },
        });
        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }
        return NextResponse.json({ notification }, { status: 200 });

    } catch {
        return NextResponse.json({ error: 'An error occurred while updating notification' }, { status: 500 });
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
