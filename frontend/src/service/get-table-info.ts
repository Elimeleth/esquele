import { apiURI } from "@/constants/api.const";

import type { DBConnectionParams } from "@/types/api-connection";
import { TableInfo } from "@/types/api-table-info";

export const getTableInfo = async (
    params: { dbConnection: DBConnectionParams; }
) => {

    return await fetch(`${apiURI}table-info`,

        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'bd-connection': params.dbConnection,

            })
        }
    )
        .then(response => {
            if (!response.ok) {
                throw Error('Tables Info Error');
            }

            return response.json() as Promise<TableInfo>;
        })

}