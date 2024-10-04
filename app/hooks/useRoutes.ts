import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FaBell, FaBriefcase, FaCommentDots, FaHome, FaUserFriends } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";


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
        icon: MdPostAdd,
    },
    ], [pathname]);
    return routes;
}

export default useRoutes;