import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies(); // await this
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = JSON.parse(userCookie);

  const formData = await req.formData();
  const file = formData.get("pdf") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDFs allowed" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.length > 100 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 100MB)" },
      { status: 400 }
    );
  }

  // for (let i = 0; i < 100; i++) {
  const encoded = buffer.toString("base64");
  const path = `uploads/${Date.now()}-${file.name}`;

  await axios.put(
    `https://api.github.com/repos/${user.login}/pdf-storage/contents/${path}`,
    {
      message: `Upload ${file.name}`,
      content: encoded,
    },
    {
      headers: { Authorization: `token ${token}` },
    }
  );
  // }

  const fileUrl = `https://raw.githubusercontent.com/${user.login}/pdf-storage/main/${path}`;

  return NextResponse.json({ success: true, url: fileUrl });
}
