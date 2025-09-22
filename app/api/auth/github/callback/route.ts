import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

async function ensurePdfRepo(token: string) {
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${token}` },
  });

  const username = userRes.data.login;

  try {
    await axios.get(`https://api.github.com/repos/${username}/pdf-storage`, {
      headers: { Authorization: `token ${token}` },
    });
    return username;
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 404) {
      await axios.post(
        "https://api.github.com/user/repos",
        {
          name: "pdf-storage",
          description: "My personal PDF storage",
          private: false,
        },
        { headers: { Authorization: `token ${token}` } }
      );
      return username;
    }
    console.log("Error while Ensure Pdfs exist");
    throw err;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log("callback receivd===========:");

  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code: code!,
  });

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    params.toString(),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("🔑 Token response:", tokenRes.data);

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${accessToken}` },
  });

  const user = userRes.data;
  await ensurePdfRepo(accessToken);

  // ✅ set cookies on the response instead of cookies().set
  //   const res = NextResponse.redirect(process.env.FRONTEND_URL!);

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/`);

  res.cookies.set("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
