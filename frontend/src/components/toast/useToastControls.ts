
import { generateRandomString } from '@/lib/utils';
import { create } from 'zustand';


type State = {
    body: string;
    duration?: number;
    id?: string;
}

type Actions = {
    show: (toast: Partial<State>) => void;
    close: () => void;
}

export const useToastStore = create<State & Actions>((set) => ({

    id: '',
    body: '',
    duration: 3000,
    show(toast: Partial<State>) {
        set({
            id: toast.id ?? `${generateRandomString(12)}-${new Date().getTime()}`,
            body: toast.body ?? "",
            duration: toast.duration ?? 3000
        });
    },
    close() {

        set({
            id: '',
            body: ''
        });
    },
}));



export function useToastControls() {
    const [show, close,] = useToastStore(
        state => [state.show, state.close]
    );

    return { show, close, };
}
