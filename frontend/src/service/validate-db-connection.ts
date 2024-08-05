// import { apiURI } from "@/constants/api.const";

import type { AIConnectionParams, DBConnectionParams } from "@/types/api-connection";
import { createDBConnection } from "./api/api";

export const validateDBConnection = async (
    params: { dbConnection: DBConnectionParams; aiConnection: AIConnectionParams }
) => {

    // return await fetch(`${apiURI}validate-db-connection`,

    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             'bd-connection': params.dbConnection,
    //             'ai-connection': params.aiConnection

    //         })
    //     }
    // )
    //     .then(response => {
    //         if (!response.ok) {
    //             throw Error('Error validando DB Connection');
    //         }

    //         return response.json();
    //     })

    return await createDBConnection(params as any)

}