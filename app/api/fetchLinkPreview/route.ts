import { getLinkPreview } from 'link-preview-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const urlParam = url.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const preview = await getLinkPreview(urlParam as string);
        return NextResponse.json({ preview }, { status: 200 });
    } catch (error) {
        console.error('Error fetching link preview:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
