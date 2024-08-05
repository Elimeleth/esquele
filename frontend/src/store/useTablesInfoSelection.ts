import { create } from "zustand";

type Selection = Map<string, string[]>;

type State = {
    selections: Selection;
    toUse: boolean;
}

type Actions = {
    update: (state: Partial<State>) => void;
    addSelection: (key: string, value: string) => void;
    removeSelectionValueFromKey: (key: string, value: string) => void;
    removeSelection: (key: string) => void;
    reset: () => void;
    getSelectionsStringMessage: () => string;
    getPromptSelectionsStringMessage: () => string;
}

export const useTablesInfoSelection = create<State & Actions>((set, state) => ({
    selections: new Map(),
    toUse: false,
    update(state) {
        set(vl => ({
            ...vl,
            ...state
        }))
    },
    addSelection(key, value) {
        set(vl => {
            const selections = new Map(vl.selections);
            const s = selections.get(key);
            if (s?.length) {
                selections.set(key, [...s, value]);
            } else {
                selections.set(key, [value]);
            }
            return {
                ...vl,
                selections
            }
        })
    },
    removeSelectionValueFromKey(key, value) {
        set(vl => {
            const selections = new Map(vl.selections);
            const values = selections.get(key);

            if (values?.length) {
                const newValues = values.filter(v => v != value);
                selections.set(key, newValues);
            }

            return {
                ...vl,
                selections
            }
        })
    },
    removeSelection(key: string) {
        set(vl => {

            vl.selections.delete(key)
            const selections = new Map(vl.selections);
            return {

                ...vl,
                selections
            }
        })
    },
    getSelectionsStringMessage() {
        const selections = state().selections;
        const arr = [...selections];
        const values = arr.map(([k, value]) => {
            const v = (value as string[]).join(',');
            return `${k}:${v};`;
        }).join('');

        if (!values.length) return '';

        return `Usa las siguientes tablas: \n${values}`;
    },
    getPromptSelectionsStringMessage() {
        const selections = state().selections;
        const arr = [...selections];
        const values = arr.map(([k, value]) => {
            const v = (value as string[]).join(',');
            return `${k}:${v};`;
        }).join('');

        if (!values.length) return '';

        return `Utiliza las siguientes tablas: ${values}
- Cada tabla comienza con el nombre seguido de dos puntos, por ejemplo, *user:*
- Los nombres de las columnas van después de los dos puntos, separados por comas y finalizados con una barra vertical *|*, por ejemplo, nombre, dirección, usuario|`;
    },
    reset() {
        set(vl => ({
            ...vl,
            toUse: false,
            selections: new Map(),
        }))
    },
}));
