import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize two Redis clients
const pubRedis = new Redis();
const subRedis = new Redis();

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        console.log('User ID:', userId);

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const stream = new ReadableStream({
            start(controller) {
                const sendNotification = (message: string) => {
                    try {
                        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
                    } catch (err) {
                        console.error('Error enqueuing message:', err);
                    }
                };

                subRedis.subscribe(userId, (err) => {
                    if (err) {
                        console.error('Failed to subscribe:', err);
                        controller.close();
                    } else {
                        console.log(`Subscribed to channel: ${userId}`);
                    }
                });

                subRedis.on('message', (channel, message) => {
                    if (channel === userId) {
                        sendNotification(message);
                    }
                });

                const cleanup = () => {
                    if (subRedis.status === 'ready') {
                        console.log(`Unsubscribed from channel: ${userId}`);
                        subRedis.unsubscribe(userId).catch((err) => console.error('Error unsubscribing:', err));
                    }
                    controller.close();
                };

                req.signal.addEventListener('abort', cleanup);
                req.signal.addEventListener('error', cleanup);
            }
        });

        const response = new NextResponse(stream);
        response.headers.set('Content-Type', 'text/event-stream');
        response.headers.set('Cache-Control', 'no-cache');
        response.headers.set('Connection', 'keep-alive');

        return response;
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export const notifyUser = async (userId: string, message: string) => {
    try {
        await pubRedis.publish(userId, JSON.stringify({ message }));
    } catch (error) {
        console.error(`Error publishing message for user ${userId}:`, error);
    }
};
