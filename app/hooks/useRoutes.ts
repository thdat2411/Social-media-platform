import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FaBell, FaBriefcase, FaCommentDots, FaHome, FaPenSquare, FaUserFriends } from "react-icons/fa";
// 


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
        href: '/jobs',
        icon: FaBriefcase,
        active: pathname === '/jobs',

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
    {
        label: 'Post a job',
        href: '/job-posting',
        icon: FaPenSquare,
    },
    ], [pathname]);
    return routes;
}

export default useRoutes;