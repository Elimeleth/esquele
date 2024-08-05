import { create } from "zustand";

type State = {
    status: 'offline' | 'initializing' | 'online';
}

type Actions = {
    update: (args: Partial<State>) => void;
}

export const useSystemStatus = create<State & Actions>((set) => ({
    status: 'offline',
    update(args) {
        set(vl => ({ ...vl, ...args }));
    },
}))