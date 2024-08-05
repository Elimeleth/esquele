import { useCallback, useState } from "react";
import { toast } from "sonner";

import { createSqlCompletion } from "@/service/slq-completions";

import { useConfigStore } from "@/store/useConfigStore"
import { APISqlCompletionsParams, SqlCompletationState } from "@/types/api-sql-completion";


export const useSqlCompletion = (update: (data: Partial<SqlCompletationState>) => void) => {
    const [typeCompletion, setTypeCompletion] = useState<"completion" | "execute" | "explain"
        | ''>('');
    const [isPending, setIsPending] = useState(false);
    const [aiConfig, dbConfig] = useConfigStore(state => [state.aiConfig, state.dbConfig]);


    const initCb = () => {
        setIsPending(false);
        update({
            event: '',
            eventUpdate: '',
            data: '',
            isPending: false,
            done: false
        });
    }

    const execute = useCallback((params: Omit<APISqlCompletionsParams, 'ai-connection' | 'bd-connection'>) => {
        setIsPending(true);
        setTypeCompletion(params.type)
        update({ isPending: true });
        createSqlCompletion({
            query: params.query,
            type: params.type,
            sql: params.sql,
            'ai-connection': aiConfig!,
            'bd-connection': dbConfig!
        }, {
            init: initCb,
            next: update,
            error: (message) => toast("Error", {
                description: message,
                duration: 3000
            })
        });
    }, [aiConfig?.validate, dbConfig?.validate]);

    return { execute, isPending, typeCompletion };
}