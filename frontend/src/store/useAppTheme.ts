import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { useLsStorage } from "./useStore";


type State = {
    dark: boolean;
}

type Actions = {
    toggleMode: () => void;
}

const _useAppTheme: StateCreator<State & Actions> = (set => ({
    dark: false,
    toggleMode() {
        set(state => ({ dark: !state.dark }));
    },
}));

export const useAppThemeStore = create<State & Actions>()(
    persist(
        _useAppTheme,
        {
            storage: useLsStorage,
            name: 'app_theme'
        }
    )
);