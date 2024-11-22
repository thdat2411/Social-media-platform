import Pusher from 'pusher';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Pusher client
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    useTLS: true,
});

// API Route to handle subscription and sending messages to Pusher
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        console.log('User ID:', userId);

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        return NextResponse.json({ message: 'User subscribed successfully' });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// Function to send notifications to Pusher channel
export const notifyUser = async (userId: string, type: string, message: string) => {
    try {
        await pusher.trigger(`user-${userId}`, 'new-notification',
            { message: message, userId: userId, type: type },
        );
        console.log(`Notification sent to user-${userId}`);
    } catch (error) {
        console.error(`Error publishing message for user ${userId}:`, error);
    }
};
