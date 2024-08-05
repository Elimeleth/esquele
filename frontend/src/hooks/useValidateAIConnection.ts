import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

import { validateAIConnection } from "@/service/validate-ai-connection";

import type { AIConnectionParams } from "@/types/api-connection";
import { useConfigStore } from "@/store/useConfigStore";



export const useValidateAIConnection = () => {
    const [updateConfig] = useConfigStore(state => [state.update]);

    const { data, error, isPending, mutate } = useMutation({
        mutationKey: ['mutation-validate-db-connection',],
        mutationFn: (params: AIConnectionParams) => validateAIConnection(params),
        onSuccess(data, vars) {
            toast("AI Connection", {
                description: data.message ?? "Conexión establecida",
            });
            updateConfig({
                aiConfig: {
                    apikey: vars.apikey,
                    model_name: vars.model_name,
                    provider: vars.provider,
                    validate: true,
                }
            })
        },
        onError(error) {
            toast("AI Connection", {
                description: error.message ?? "Error estableciendo conexión",
            });
        },
    });


    return { data, isPending, error, validate: mutate }

}