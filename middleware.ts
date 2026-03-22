import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // const supabase = createServerClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //     {
    //         cookies: {
    //             getAll() {
    //                 return request.cookies.getAll()
    //             },
    //             setAll(cookiesToSet) {
    //                 cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
    //                 response = NextResponse.next({
    //                     request: {
    //                         headers: request.headers,
    //                     },
    //                 })
    //                 cookiesToSet.forEach(({ name, value, options }) =>
    //                     response.cookies.set(name, value, options)
    //                 )
    //             },
    //         },
    //     }
    // )
    // const path = request.nextUrl.pathname;
    // const isLoginPage = path.endsWith('/sign-in');
    //
    // const isModerator = path.startsWith('/moderator');
    // const isOrganizer = path.startsWith('/organizer');
    //
    // let loginUrl = '/sign-in';
    // let dashboardUrl = '/dashboard';
    //
    // if (isModerator) {
    //     loginUrl = '/moderator/sign-in';
    //     dashboardUrl = '/moderator/dashboard';
    // } else if (isOrganizer) {
    //     loginUrl = '/organizer/sign-in';
    //     dashboardUrl = '/organizer/dashboard';
    // }
    //
    // const { data: { user } } = await supabase.auth.getUser()
    //
    // if (!user && !isLoginPage) {
    //     return NextResponse.redirect(new URL(loginUrl, request.url));
    // }
    //
    // if (user && isLoginPage) {
    //     return NextResponse.redirect(new URL(dashboardUrl, request.url));
    // }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}