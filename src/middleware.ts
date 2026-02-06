export { auth as middleware } from "@/lib/auth-config"

export const config = {
  matcher: ["/backoffice/:path*", "/backoffice"],
}
