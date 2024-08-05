import { useMutation } from "@tanstack/react-query"

import type { DBConnectionParams } from "@/types/api-connection";

import { useTablesInfoStore } from "@/store/useTableInfoStore";
import { getTableInfo } from "@/service/get-table-info";




export const useGetTableInfo = () => {
    const [updateTablesInfo] = useTablesInfoStore(state => [state.update]);

    const { data, error, isPending, mutate } = useMutation({
        mutationKey: ['mutation-tables-info',],
        mutationFn: (params: DBConnectionParams) => getTableInfo({
            dbConnection: params

        }),
        onSuccess(data, _) {
            updateTablesInfo({
                tables: data.tableInfo
            })
        },
    });


    return { data, isPending, error, execute: mutate }

}