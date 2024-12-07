import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const ignoredPaths = [
        "/home",
        "/signin",
        "/signup",
        "/api/register",
        "/api/register/check-email",
        "/api/register/user",
        "/api/register/job-preference",
        "/forgot-password",
        "/api/email",
        "/api/suggestion",
      ];

      return ignoredPaths.includes(req.nextUrl.pathname) || !!token;
    },
  },
  pages: {
    signIn: "/home",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
