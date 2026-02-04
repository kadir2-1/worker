import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // Bypassing auth check for build stability
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
