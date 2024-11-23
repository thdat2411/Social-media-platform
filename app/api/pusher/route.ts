
import { NextRequest, NextResponse } from 'next/server';

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

