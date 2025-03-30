import NextAuth from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Auth0],
  callbacks: {
    async session({ session }) {
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
});
