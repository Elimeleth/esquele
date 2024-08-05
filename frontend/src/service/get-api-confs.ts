// import { apiURI } from "@/constants/api.const";
import type { APIConfsResponse } from "@/types/api-confs";
import { configurations } from "./api/api";

export const getAPIConfs = (): APIConfsResponse => {

    // return await fetch(`${apiURI}confs`)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw Error('Error obteniendo configuración');
    //         }

    //         return response.json() as Promise<APIConfsResponse>;
    //     })

    return configurations()

}