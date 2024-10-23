import { prisma } from "@/lib/prisma";

export const checkValidEmail = async (email: string) => {
  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return false;
    }
    return true;
  } catch {
    return null;
  }
};
