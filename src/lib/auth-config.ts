import NextAuth from "next-auth"

// Lightweight auth config for Edge Runtime (middleware)
// Does not include Prisma, bcrypt, or other heavy dependencies
export const { auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/backoffice",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnBackoffice = nextUrl.pathname.startsWith('/backoffice')
      const isOnLoginPage = nextUrl.pathname === '/backoffice'
      
      // Allow access to login page
      if (isOnLoginPage) {
        return true
      }
      
      // Require auth for other backoffice pages
      if (isOnBackoffice) {
        return isLoggedIn
      }
      
      return true
    },
  },
  providers: [],
})
