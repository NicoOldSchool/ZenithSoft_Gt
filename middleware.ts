import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Nota: No usamos cookies de Supabase en middleware, solo dejamos pasar
export async function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
