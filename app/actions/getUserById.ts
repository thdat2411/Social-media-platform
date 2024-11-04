import { prisma } from "@/lib/prisma";

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}