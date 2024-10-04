import { usePathname } from "next/navigation";
import { useMemo } from "react"

const useSearchingCategoriesList = () => {
    const pathname = usePathname();
    const list = useMemo(() => [{
        label: "Jobs",
        href: "#jobs",
        active: pathname === '/jobs/search',
        pathname: '/jobs/search'
    },
    {
        label: "Posts",
        href: "#posts",
        active: pathname === "/search/posts",
        pathname: '/search/posts'
    },
    {
        label: "People",
        href: "#people",
        active: pathname === '/search/people',
        pathname: '/search/people',
    },
    ], []);
    return list
}
export default useSearchingCategoriesList;