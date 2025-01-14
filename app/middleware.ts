// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/lib/firebase"; // Import auth from the firebase file
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function middleware(req: NextRequest) {
  return new Promise((resolve) => {
    // Listen to the auth state change
    onAuthStateChanged(auth, (user) => {
      if (!user && req.url.includes("/admin")) {
        // If the user is not authenticated and trying to access admin, redirect to login
        return resolve(NextResponse.redirect(new URL("/login", req.url)));
      }
      // Allow all other requests or authenticated requests
      return resolve(NextResponse.next());
    });
  });
}
