import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { environment } from '@/config/env';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.get(`${environment.hawkbitApiUrl}/rest/v1/userinfo`, {
            headers: {
              Authorization: `Basic ${Buffer.from(`${credentials?.username}:${credentials?.password}`).toString('base64')}`,
              Accept: 'application/json, application/hal+json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          });

          if (!response.data) {
            return null;
          }

          return {
            id: response.data.tenant + response.data.username,
            tenant: response.data.tenant,
            username: response.data.username,
            hawkbitAuth: Buffer.from(`${credentials?.username}:${credentials?.password}`).toString('base64'),
          };
        } catch {
          console.error('Authentication failed');
          return null;
        }
      },
    }),
  ],
  // Idle timeout: with the JWT strategy every call to /api/auth/session re-issues the session cookie with a new
  // expiry (updateAge only applies to database sessions, so it is not set). The browser calls that endpoint only
  // on user activity (see useRefreshSessionOnActivity); the hawkBit proxy and the background polling never renew it.
  session: {
    strategy: 'jwt',
    maxAge: environment.sessionIdleTimeout,
  },
  jwt: {
    maxAge: environment.sessionIdleTimeout,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenant = user.tenant;
        token.username = user.username;
        token.hawkbitAuth = user.hawkbitAuth;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.tenant = token.tenant;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
