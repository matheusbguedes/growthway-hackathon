import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // const token = req.nextauth.token;
    // const pathname = req.nextUrl.pathname;

    // if (token && pathname === "/")
    //   return NextResponse.redirect(new URL("/dashboard", req.url));

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  },
);

export const config = {
  matcher: ["/:path*"],
};
