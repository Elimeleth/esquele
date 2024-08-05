import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import { useLsStorage } from './useStore';
import type { TableInfoElement } from '@/types/api-table-info';

type State = {
    tables: TableInfoElement[];
};

type Actions = {
    update: (params: Partial<State> | ((data: State) => Partial<State>)) => void;
}

const _useTablesInfoStore: StateCreator<State & Actions> = (set) => ({
    tables: [],
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

export const useTablesInfoStore = create<State & Actions>()(
    persist(
        _useTablesInfoStore, {
        name: 'tables_info',
        storage: useLsStorage
    }
    )
)