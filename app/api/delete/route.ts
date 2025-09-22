import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  if (!token || !userCookie)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const user = JSON.parse(userCookie);
  const { fileName } = await req.json();

  if (!fileName)
    return NextResponse.json({ error: "File name required" }, { status: 400 });

  const filePath = `uploads/${fileName}`;
  const repo = "pdf-storage";

  try {
    const fileRes = await axios.get(
      `https://api.github.com/repos/${user.login}/${repo}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}` } }
    );

    const sha = fileRes.data.sha;

    await axios.delete(
      `https://api.github.com/repos/${user.login}/${repo}/contents/${filePath}`,
      {
        headers: { Authorization: `token ${token}` },
        data: { message: `Delete ${fileName}`, sha },
      }
    );

    return NextResponse.json({ success: true, file: fileName });
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 404)
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
