/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const { email, name, password } = body;
        if (!email || !password || !name) {
            return new NextResponse('Missing info', { status: 400 });
        }

        const isExistingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (isExistingEmail) {
            return new NextResponse('Email already exists', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password_hash: hashedPassword,
            }
        });

        return NextResponse.json(user);
    } catch (err: any) {
        return new NextResponse(err.message, { status: 500 });
    }

}