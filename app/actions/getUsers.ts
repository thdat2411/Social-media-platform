import getSession from "./getSession";
import { prisma } from "@/lib/prisma";

const getUsers = async () => {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }
    try {
        const users = await prisma.user.findMany(
            {
                orderBy: {
                    created_at: "desc"
                },
                where: {
                    NOT: {
                        email: session.user.email
                    }
                }
            }
        )
        return users;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return [];
    }
}
export default getUsers;