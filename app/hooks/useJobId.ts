import { useParams } from "next/navigation"

export const useJobId = () => {
    const params = useParams();
    return params.searchId as string;
}