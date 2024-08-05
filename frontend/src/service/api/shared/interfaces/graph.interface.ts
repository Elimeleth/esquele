import { BaseMessage } from "@langchain/core/messages";

export interface GraphState {
    messages: BaseMessage[];
    query: string;
    sql: string;
    feedback: string;
    context: string;
    error?: string;
    result: string;
    retries: number;
    maxRetries: number;
}