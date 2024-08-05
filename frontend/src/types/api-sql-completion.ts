import type { AIConnectionParams, DBConnectionParams } from "./api-connection";

export interface APISqlCompletionsParams {
    query: string;
    sql?: string;
    type: 'completion' | 'execute' | 'explain';
    "ai-connection": AIConnectionParams;
    "bd-connection": DBConnectionParams;
}

export interface SqlCompletationState {
    event: string;
    data: string;
    eventUpdate: string;
    done: boolean;
    isPending: boolean;
}