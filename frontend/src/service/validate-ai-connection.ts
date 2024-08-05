// import { apiURI } from "@/constants/api.const";

import type { AIConnectionParams } from "@/types/api-connection";
import { createAIConnection } from "./api/api";

export const validateAIConnection = async (
    params: AIConnectionParams
) => {

    // return await fetch(`${apiURI}validate-ai-connection`,

    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ 'ai-connection': params })
    //     }
    // )
    //     .then(response => {
    //         if (!response.ok) {
    //             throw Error('Error validando AI Connection');
    //         }

    //         return response.json();
    //     })

    return await createAIConnection(params as any)

}