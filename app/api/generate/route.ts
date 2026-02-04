import { NextResponse } from 'next/server';
import { generateShopifyTheme } from '@/lib/worker';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const files = await generateShopifyTheme(prompt);

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate theme' }, { status: 500 });
    }
}
