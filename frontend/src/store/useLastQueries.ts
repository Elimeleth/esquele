import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { useLsStorage } from "./useStore";

type State = {
    queries: string[];
    query: string;
    filter: string;
}

type Actions = {
    update: (query: string) => void;
    filterQuery: (query: string) => void;
    removeFilter: () => void;
    removeQuery: (position: number) => void;
}

const _useLastQueries: StateCreator<State & Actions> = ((set) => ({
    queries: [],
    query: '',
    filter: '',
    update(query) {
        set(vl => {
            const q = vl.queries.some(q => q == query);
            const queries = q ? vl.queries : [...vl.queries, query]
            return { queries, query }
        })
    },
    filterQuery(query) {
        set(vl => ({
            ...vl,
            filter: query,
            query: vl.query != query ? query : vl.query
        }));
    },
    removeFilter() {
        set(vl => ({
            ...vl,
            filter: ''
        }));
    },
    removeQuery(position) {
        set(vl => {
            const newQ = vl.queries.filter((_, i) => i != position);

            return {
                ...vl,
                queries: newQ,

            }
        })
    },
}));

export const useLastQueries = create<State & Actions>()(
    persist(
        _useLastQueries, {
        name: 'last_queries',
        storage: useLsStorage
    }
    )
)