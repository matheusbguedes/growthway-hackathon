import api from "@/lib/api";
import { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await api.post("/signin", {
            email: credentials.email,
            password: credentials.password,
          });

          const { token } = data;
          const user: User = jwtDecode(token);

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              access_token: token,
            };
          }
        } catch (error) {
          console.log(error);
          return null;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.access_token = user.access_token;
      }

      if (trigger === "update") {
        token.name = session.user.name;
        token.access_token = session.user.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.access_token = token.access_token as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
