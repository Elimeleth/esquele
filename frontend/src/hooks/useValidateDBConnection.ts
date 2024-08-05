import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

import { validateDBConnection } from "@/service/validate-db-connection";

import type { DBConnectionParams } from "@/types/api-connection";
import { DbEngine, useConfigStore } from "@/store/useConfigStore";
import { useGetTableInfo } from "./useTableInfo";
import { XTABLEVSITEMSTORAGE } from "@/constants/platform.const";




export const useValidateDBConnection = () => {
    const [aiConfig, updateConfig] = useConfigStore(state => [state.aiConfig, state.update]);
    const { execute } = useGetTableInfo();
    const { data, error, isPending, mutate } = useMutation({
        mutationKey: ['mutation-validate-db-connection',],
        mutationFn: (params: DBConnectionParams) => validateDBConnection({
            aiConnection: {
                apikey: aiConfig!.apikey,
                model_name: aiConfig!.model_name,
                provider: aiConfig!.provider
            },
            dbConnection: params

        }),
        onMutate(_) {
            updateConfig({
                isValidatingDb: true
            });
        },
        onSuccess(data, vars) {
            toast("DB Connection", {
                description: data.message ?? "Conexión establecida",
            });
            if (data['vs_id']) {
                localStorage.setItem(XTABLEVSITEMSTORAGE, data['vs_id'])
            }

            updateConfig({
                dbConfig: {
                    provider: vars.provider as DbEngine,
                    schema: vars.schema,
                    type: vars.type,
                    url: vars.url,
                    validate: true
                },
                isValidatingDb: false
            });

            execute(vars);
        },
        onError(error) {
            toast("DB Connection", {
                description: error.message ?? "Error estableciendo conexión",
            });
            updateConfig({
                isValidatingDb: false
            })
        },
    });


    return { data, isPending, error, validate: mutate }

}