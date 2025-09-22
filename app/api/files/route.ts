import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { Files } from "@/app/types/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const user = JSON.parse(userCookie);
  const url = `https://api.github.com/repos/${user.login}/pdf-storage/contents/uploads`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${token}` },
    });

    const files = response.data
      .filter((item: Files) => item.type === "file")
      .map((item: Files) => ({
        name: item.name,
        path: item.path,
        download_url: item.download_url,
      }));

    return NextResponse.json(files);
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 404)
      return NextResponse.json([]);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
