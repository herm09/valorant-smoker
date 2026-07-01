import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

declare module "next-auth" {
    interface Session {
        user: { id: string; email: string; name?: string | null; image?: string | null };
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email:    { label: "Email",    type: "email"    },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email    = credentials?.email;
                const password = credentials?.password;
                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return null;

                return { id: user.id, email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        session({ session, token }) {
            if (token?.id) session.user.id = token.id as string;
            return session;
        },
    },
    pages: { signIn: "/login" },
};
