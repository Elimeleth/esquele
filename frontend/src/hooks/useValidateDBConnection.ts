import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

import { validateDBConnection } from "@/service/validate-db-connection";

import type { DBConnectionParams } from "@/types/api-connection";
import { useConfigStore } from "@/store/useConfigStore";




export const useValidateDBConnection = () => {
    const [aiConfig, updateConfig] = useConfigStore(state => [state.aiConfig, state.update]);

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
        onSuccess(data, vars) {
            toast("DB Connection", {
                description: data.message ?? "Error estableciendo conexión",
            });
            updateConfig({
                dbConfig: {
                    provider: vars.provider,
                    schema: vars.schema,
                    type: vars.type,
                    url: vars.url,
                    validate: true
                }
            })
        },
        onError(error) {
            toast("DB Connection", {
                description: error.message ?? "Error estableciendo conexión",
            });
        },
    });


    return { data, isPending, error, validate: mutate }

}