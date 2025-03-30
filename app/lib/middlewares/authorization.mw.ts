import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../session/security";

const protectedRoutes = ["/dashboard", "/addUser", "/manage-user", "/add-client", "/manage-client","/vault", "/add-loan", "/loan-recovery", "/approve-loan-payment","/user-profile"];
const publicRoutes = ["/"];

export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Fetch and decrypt session from cookies
  const cookie = req.cookies.get("session")?.value; // Updated: Use `req.cookies` directly
  const session = cookie ? decrypt(cookie) : null;


  // Redirect logged-out users trying to access protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect authenticated users trying to access public routes
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access
  return NextResponse.next();
}



