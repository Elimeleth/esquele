import { apiURI } from "@/constants/api.const";
import type { APIConfsResponse } from "@/types/api-confs";

export const getAPIConfs = async (): Promise<APIConfsResponse> => {

    return await fetch(`${apiURI}confs`)
        .then(response => {
            if (!response.ok) {
                throw Error('Error obteniendo configuración');
            }

            return response.json() as Promise<APIConfsResponse>;
        })

}