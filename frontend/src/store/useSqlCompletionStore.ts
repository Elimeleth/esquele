import { create } from "zustand";
import { SqlCompletationState } from "@/types/api-sql-completion";

type State = {
    completions: SqlCompletationState[];
    position: number;
};

type Actions = {
    update: (args: Partial<State> | ((data: State) => Partial<State>)) => void;
    addCompletion: (completion: SqlCompletationState) => void;
    updateWithPosition: (completion: Partial<SqlCompletationState>) => void;
    updateAndIncrementPosition: (completion: Partial<SqlCompletationState>) => void;
}

export const useSqlCompletionStore = create<State & Actions>((set) => ({
    completions: [],
    position: 0,
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
    addCompletion(completion) {
        set(vl => ({
            ...vl,
            completions: [...vl.completions, completion],
            position: vl.position + 1

        }));
    },
    updateWithPosition(completion) {

        set(vl => {
            const position = vl.position;
            const before = vl.completions[position];
            vl.completions[position] = {
                event: before?.event ?? "",
                data: before?.data ?? "",
                done: before?.done ?? false,
                isPending: before?.isPending ?? false,
                eventUpdate: before?.eventUpdate ?? "",
                type: undefined,
                ...completion
            }
            return {
                ...vl,
                completions: [...vl.completions],
            }
        })
    },
    updateAndIncrementPosition(completion) {
        set(vl => {
            const position = vl.position;
            const before = vl.completions[position];
            vl.completions[position] = {
                event: before?.event ?? "",
                data: before?.data ?? "",
                done: before?.done ?? false,
                isPending: before?.isPending ?? false,
                eventUpdate: before?.eventUpdate ?? "",
                ...completion
            }
            return {
                ...vl,
                completions: [...vl.completions],
                // position: completion.done ? position + 1 : position
            }
        })
    },
}));