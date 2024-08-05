import { create } from 'zustand';

import type { AIConnection, DBConnection, } from "@/types/api-confs"


type State = {
    aiConnection: AIConnection[];
    dbConnection: DBConnection[];
};

type Actions = {
    update: (params: Partial<State>) => void;
}

export const useAPIConfsStore = create<State & Actions>((set) => ({
    aiConnection: [],
    dbConnection: [],
    update(params) {
        set(vl => ({ ...vl, ...params }));
    },
}))