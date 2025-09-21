import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Logging out");

    const res = NextResponse.json({ message: "Logged out successfully" });

    res.cookies.set("token", "", { maxAge: 0, path: "/" });
    res.cookies.set("user", "", { maxAge: 0, path: "/" });

    return res;
  } catch (error) {
    console.log("error while logout");
    return NextResponse.json(
      {
        message: `Unable to logout currently, please try after some time. ${error}`,
      },
      { status: 401 }
    );
  }
}
