import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer: process.env.AUTH_AUTH0_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
      wellKnown: `${process.env.AUTH_AUTH0_ISSUER}.well-known/openid-configuration`,
      idToken: true,
      checks: ["pkce", "state"],
    })
  ],
  callbacks: {
    async session({ session }) {
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
});
