import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

// ** Middleware function invoke only when authorized callback return TRUE.

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({token,req})=>{
                const {pathname} = req.nextUrl

                // Allow auth related Routes

                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" 
                ){
                    return true;
                }

                // Public Path
                if(pathname === '/' || pathname.startsWith("/api/videos")){
                    return true;
                }

                return !!token;

            }
        }
    }
)


// Where Middleware run

export const config = {
    matcher : ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
}