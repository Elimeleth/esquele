import ls from 'localstorage-slim';
import encUTF8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';

import { createJSONStorage, type StateStorage } from 'zustand/middleware';

import { SECRET_KEY_ENCRYPT } from '@/constants/platform.const';

ls.config.encrypt = true; // global encryption
ls.config.secret = SECRET_KEY_ENCRYPT; // global secret

// update encrypter to use AES encryption
ls.config.encrypter = (data: any, secret: any) => AES.encrypt(data, secret).toString();

// update decrypter to decrypt AES-encrypted data
ls.config.decrypter = (data: any, secret: any) => {
    try {
        return AES.decrypt(data, secret).toString(encUTF8);
    } catch (e) {
        // incorrect/missing secret, return the encrypted data instead
        return data;
    }
};

export const lStore = ls;

export const lsStorage: StateStorage = {
    getItem: async function (name: string): Promise<string | null> {
        const data =
            ls.get(name, {
                decrypt: true,
                decrypter: (data: any, secret: any) => {
                    try {
                        const decryted = AES.decrypt(data, secret).toString(encUTF8);
                        return decryted;
                    } catch (e) {
                        // incorrect/missing secret, return the encrypted data instead
                        return data;
                    }
                },
            }) ?? null;

        return data as string | null;
    },
    setItem: async function (name: string, value: string): Promise<void> {
        ls.set(name, value);

        return;
    },
    removeItem: async function (name: string): Promise<void> {
        ls.remove(name);

        return;
    },
};


export const useLsStorage = createJSONStorage(() => lsStorage);
