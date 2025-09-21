import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { GitHubUser } from "../../types/types";

export type SessionData = {
  token?: string;
  user?: GitHubUser;
};

const sessionPassword = process.env.SESSION_PASSWORD || process.env.SESSION_SECRET || "";
const sessionOptions = {
  cookieName: "adicloud_session",
  password: sessionPassword,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  },
};

function ensureSessionPassword() {
  if (!sessionPassword || sessionPassword.length < 16) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SESSION_PASSWORD/SESSION_SECRET is missing or weak. Set a strong value (16+ chars) in .env.local"
      );
    } else {
      throw new Error("SESSION_PASSWORD/SESSION_SECRET is required in production");
    }
  }
}

export async function getSession(): Promise<IronSession<SessionData>> {
  ensureSessionPassword();
  const cookieStore = await cookies();
  // @ts-expect-error iron-session expects a compatible cookies object; next/headers works
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
