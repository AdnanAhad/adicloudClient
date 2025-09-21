import { NextResponse } from "next/server";

export async function GET() {
  console.log("Received a login request");

  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=public_repo&redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/github/callback`;

  console.log("Redirecting to:", redirectUrl);

  return NextResponse.redirect(redirectUrl);
}
