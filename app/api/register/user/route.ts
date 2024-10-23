/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const { email, name, password_hash, full_name, role, } = body;
        if (!email || !password_hash || !name || !full_name || !role) {
            return new NextResponse('Missing info', { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password_hash: hashedPassword,
                full_name,
                role,
            }
        });

        return NextResponse.json(user);
    } catch (err: any) {
        return new NextResponse(err.message, { status: 500 });
    }

}