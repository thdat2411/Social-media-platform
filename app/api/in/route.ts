import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "user is not found" }, { status: 400 })
        }
        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const body = await req.json();
        if (action === "edit-intro") {
            const { firstName, lastName, countryValue, cityValue, headLine } = body;
            if (!firstName || !lastName || !countryValue || !cityValue || !headLine) {
                return NextResponse.json({ error: "missing required fields" }, { status: 400 })
            }
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: firstName + " " + lastName,
                    location: countryValue + ", " + cityValue,
                    headline: headLine
                }
            })
            if (!updatedUser) {
                return NextResponse.json({ error: "user is not found" }, { status: 400 })
            }
            return NextResponse.json({ updatedUser }, { status: 200 })
        }
        else {
            const { phoneNumber, address, birthDate } = body;
            console.log(phoneNumber, address, birthDate);
            if (!phoneNumber || !address || !birthDate) {
                return NextResponse.json({ error: "missing required fields" }, { status: 400 })
            }
            console.log("pass");
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    phone_number: Number(phoneNumber),
                    address,
                    birth_date: new Date(birthDate)
                }
            })
            if (!updatedUser) {
                return NextResponse.json({ error: "user is not found" }, { status: 400 })
            }
            return NextResponse.json({ updatedUser }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}