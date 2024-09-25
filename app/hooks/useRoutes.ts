import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FaBell, FaBriefcase, FaCommentDots, FaHome, FaUserFriends } from "react-icons/fa";

const useRoutes = () => {
    const pathname = usePathname();

    const routes = useMemo(() => [{
        label: 'Home',
        href: '/feed',
        icon: FaHome,
        active: pathname === '/feed',
    },
    {
        label: 'My Network',
        href: '/mynetwork',
        icon: FaUserFriends,
        active: pathname === '/mynetwork',

    },

    {
        label: 'Jobs',
        href: '/job',
        icon: FaBriefcase,
        active: pathname === '/job',

    },
    {
        label: 'Messaging',
        href: '/message',
        icon: FaCommentDots,
        active: pathname === '/message',

    },
    {
        label: 'Notifications',
        href: '/notification',
        icon: FaBell,
        active: pathname === '/notification',

    },
    ], [pathname]);
    return routes;
}

export default useRoutes;