import { useQuery } from "@tanstack/react-query"
import { getAPIConfs } from "@/service/get-api-confs"



export const useAPIConfs = () => {
    const { data, error, isPending } = useQuery({
        queryKey: ['query-api-confs',],
        queryFn: () => getAPIConfs()
    });


    return { data, isPending, error }

}