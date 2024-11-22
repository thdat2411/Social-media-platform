// import getCurrentUser from "@/app/actions/getCurrentUser";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const user = await getCurrentUser();
//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }
//         if ()
//             const unreadNotifications = await prisma.notification.count({
//                 where: {
//                     user_id: user.id,
//                     is_read: false,
//                 },
//             });
//         if (unreadNotifications === 0) {
//             return NextResponse.json({ message: 'No unread notifications' }, { status: 200 });
//         }
//         return NextResponse.json({ unreadCount: unreadNotifications }, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ error: err }, { status: 500 });
//     }

// }