import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // If the user is not authenticated and is trying to access a protected route
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated
  if (session) {
    // Check if the user has an establishment
    const { data: memberData, error } = await supabase
      .from('miembros_establecimiento')
      .select('establecimiento_id')
      .eq('user_id', session.user.id)
      .single();

    const hasEstablishment = memberData && memberData.establecimiento_id;
    
    // If user has no establishment and is not on the creation page, redirect them
    if (!hasEstablishment && pathname !== '/dashboard/new-establishment') {
      return NextResponse.redirect(new URL('/dashboard/new-establishment', request.url));
    }

    // If user has an establishment but is trying to access the creation page, redirect them to the dashboard
    if (hasEstablishment && pathname === '/dashboard/new-establishment') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
