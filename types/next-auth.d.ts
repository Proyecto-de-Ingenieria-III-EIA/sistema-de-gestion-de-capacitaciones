import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    sessionToken?: string; 
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      roleId?: number;
    };
  }
}