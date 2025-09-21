import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;

  console.log("Meee got hittt");

  if (!token || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    // Parse user JSON string stored in cookie
    const parsedUser = JSON.parse(user);
    return NextResponse.json(parsedUser);
  } catch (err) {
    console.error("Failed to parse user cookie", err);
    return NextResponse.json(
      { error: "Invalid user session" },
      { status: 400 }
    );
  }
}
