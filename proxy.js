import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname.startsWith('/_next/webpack-hmr')) {
    return new NextResponse(null, { status: 200 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/_next/webpack-hmr/:path*',
  ],
}
