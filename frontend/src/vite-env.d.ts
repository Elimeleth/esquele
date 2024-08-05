/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URI: string;
    readonly VITE_X_TABLE_VS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}