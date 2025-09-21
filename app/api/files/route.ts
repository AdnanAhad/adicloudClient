import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item.type === "file")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        name: item.name,
        path: item.path,
        url: item.download_url,
      }));

    return NextResponse.json(files);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response?.status === 404) return NextResponse.json([]);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
