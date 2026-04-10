import {createClient} from '@/lib/supabase/server'
import {NextResponse, type NextRequest} from 'next/server'

export async function proxy(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = await createClient()
    const {data: {user}, error} = await supabase.auth.getUser()
    if (error) console.error("Supabase Auth Error:", error.message);
    console.log(user)

    const {pathname} = request.nextUrl
    const isModeratorPath = pathname.startsWith('/moderator')
    const isOrganizerPath = pathname.startsWith('/organizer')
    const authRoutes = ['/sign-in', '/sign-in/verify', '/forgot-password', '/reset-password']
    const isTryingAuth = authRoutes.some(route => pathname.endsWith(route))

    if (user) {
        const {data: userData} = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        let role = userData?.role
        role = role === 'PARTICIPANT' ? 'organizer' : 'moderator';

        if (isTryingAuth && role) {
            return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
        }

        if (role === 'organizer' && isModeratorPath) {
            return NextResponse.redirect(new URL('/organizer/dashboard', request.url))
        }
        if (role === 'moderator' && isOrganizerPath) {
            return NextResponse.redirect(new URL('/moderator/dashboard', request.url))
        }
    }

    if (!user) {
        const isProtectedPath = (isModeratorPath || isOrganizerPath) && !isTryingAuth
        if (isProtectedPath) {
            const targetRole = isModeratorPath ? 'moderator' : 'organizer'
            return NextResponse.redirect(new URL(`/${targetRole}/sign-in`, request.url))
        }
    }
    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
