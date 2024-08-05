import { create } from "zustand";
import { SqlCompletationState } from "@/types/api-sql-completion";

type State = SqlCompletationState;

type Actions = {
    update: (args: Partial<State> | ((data: State) => Partial<State>)) => void;
}

export const useSqlGenerationStore = create<State & Actions>((set) => ({
    event: '',
    data: '',
    eventUpdate: '',
    done: false,
    isPending: false,
    update(args) {

        if (typeof args == 'function') {
            set(vl => {
                const data = args(vl);
                return {
                    ...vl,
                    ...data
                }
            })
        }
        set(vl => ({
            ...vl,
            ...args
        }))
    },
}));