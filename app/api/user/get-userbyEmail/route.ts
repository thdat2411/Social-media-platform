import getCurrentUser from "@/app/actions/getCurrentUser";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        if (!email) {
            return NextResponse.json({ error: "Email not found" }, { status: 404 });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user: user }, { status: 200 });
    } catch (err) {
        console.error(err);
    }
}
