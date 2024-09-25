import { useMemo } from "react"

const useSearchingCategoriesList = () => {
    const list = useMemo(() => [{
        label: "Jobs",
        href: "#jobs"
    },
    {
        label: "Posts",
        href: "#posts"
    },
    {
        label: "People",
        href: "#people"
    },
    ], []);
    return list
}
export default useSearchingCategoriesList;