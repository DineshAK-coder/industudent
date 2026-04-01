import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { ROLE_REDIRECT } from "@/lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/",
    error: "/auth/error",
    newUser: "/onboarding",
  },

  callbacks: {
    /**
     * Called whenever a session is checked (server or client).
     * We attach role, profileId and hasProfile to the session.
     */
    async session({ session, user }) {
      if (!user?.id) return session;

      // Fetch the user's role and profile status in one query
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          role: true,
          studentProfile: { select: { id: true } },
          companyProfile: { select: { id: true } },
          reviewerProfile: { select: { id: true } },
        },
      });

      if (!dbUser) return session;

      const profileId =
        dbUser.studentProfile?.id ??
        dbUser.companyProfile?.id ??
        dbUser.reviewerProfile?.id ??
        null;

      session.user.id = user.id;
      session.user.role = dbUser.role;
      session.user.profileId = profileId;
      session.user.hasProfile = profileId !== null;

      return session;
    },

    /**
     * Called after sign-in. Redirect new users to onboarding,
     * returning users to their role dashboard.
     */
    async redirect({ url, baseUrl }) {
      // If the redirect URL is the site's own base, check session for role
      if (url.startsWith(baseUrl) || url === "/") {
        return url;
      }
      return baseUrl;
    },
  },

  events: {
    /**
     * On first sign-in via Google, the user gets Role.STUDENT by default.
     * We update this to a placeholder — actual role is set in onboarding.
     */
    async createUser({ user }) {
      // New users start with STUDENT role as placeholder.
      // The onboarding flow allows them to choose their actual role.
      await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.STUDENT },
      });
    },
  },

  // Trust the host header in production (required for Vercel, Railway, etc.)
  trustHost: true,
});

/**
 * Helper: get the role-based redirect path for a given role.
 */
export function getRoleRedirect(role: Role): string {
  return ROLE_REDIRECT[role] ?? "/onboarding";
}
