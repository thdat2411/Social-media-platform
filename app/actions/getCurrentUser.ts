import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
};

export default getCurrentUser;
