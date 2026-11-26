import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_ROLE_PERMISSIONS,
  RolePermissionsMap,
  isRouteAllowedForRole,
} from "@/lib/auth-rbac";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/users",
  "/moderation",
  "/notifications",
  "/support",
  "/subscriptions",
  "/payments",
  "/cms",
  "/admin-users",
  "/settings",
  "/audit-logs",
  "/system-health",
  "/verification",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const roleCookie = request.cookies.get("dating_admin_role")?.value;
  if (!roleCookie) {
    return NextResponse.next();
  }

  const role = decodeURIComponent(roleCookie);
  let perms: RolePermissionsMap = DEFAULT_ROLE_PERMISSIONS;
  const permsCookie = request.cookies.get("dating_admin_perms")?.value;
  if (permsCookie) {
    try {
      perms = JSON.parse(decodeURIComponent(permsCookie));
    } catch {
      perms = DEFAULT_ROLE_PERMISSIONS;
    }
  }

  if (!isRouteAllowedForRole(role, pathname, perms)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/users/:path*",
    "/moderation/:path*",
    "/notifications/:path*",
    "/support/:path*",
    "/subscriptions/:path*",
    "/payments/:path*",
    "/cms/:path*",
    "/admin-users/:path*",
    "/settings/:path*",
    "/audit-logs/:path*",
    "/system-health/:path*",
    "/verification/:path*",
  ],
};
