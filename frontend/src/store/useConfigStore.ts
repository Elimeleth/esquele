import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import { useLsStorage } from './useStore';

type State = {
    aiConfig: {
        provider: string;
        apikey: string;
        model_name: string;
        validate: boolean;
    } | null;
    dbConfig: {
        provider: string;
        url: string;
        type: any;
        schema: string;
        validate: boolean;
    } | null;
};

type Actions = {
    update: (params: Partial<State> | ((data: State) => Partial<State>)) => void;
}

const _useConfigStore: StateCreator<State & Actions> = (set) => ({
    aiConfig: {
        apikey: '',
        model_name: '',
        provider: '',
        validate: false

    },
    dbConfig: {
        provider: "",
        url: "",
        schema: "",
        type: "",
        validate: false
    },
    update(arg) {
        if (typeof arg == 'function') {
            set(vl => {
                const data = arg(vl);
                return {
                    ...vl,
                    ...data
                }
            })
        }
        set(vl => ({ ...vl, ...arg }));
    },
});

export const useConfigStore = create<State & Actions>()(
    persist(
        _useConfigStore, {
        name: 'environments_cnfs',
        storage: useLsStorage
    }
    )
)