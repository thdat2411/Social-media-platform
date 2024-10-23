import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const ignoredPaths = ['/', '/signin', '/signup', '/api/register', '/api/register/check-email', '/api/register/user', '/api/register/job-preference'];
            return ignoredPaths.includes(req.nextUrl.pathname) || !!token;
        },
    },
    pages: {
        signIn: '/',
    },
});
