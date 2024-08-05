import { workflow } from "../../ai/graph";
import { create_connection } from "../../ai/db/engine.db";
import { semanticFilterRetriever } from "../../ai/rag/semantic-filter.rag";
import { create_vs_connection } from "../../ai/retriever";

import OpenaiEmbedding from "../../ai/models/embedding.model";
import ModelFactory from "../../ai/models";
import { GraphState } from "../../shared/interfaces/graph.interface";
import { sleep } from "../../shared/utils/sleep.fn";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { PregelOutputType } from "node_modules/@langchain/langgraph/dist/pregel";

type SqlCompletionValidatorType = {
    query: string;
    type?: "completion" | "explain" | "execute";  // Opcional, con valor predeterminado "completion"
    sql?: string;  // Opcional, con valor predeterminado ""
    "ai-connection": {
        temperature?: number;  // Opcional, con valor predeterminado 0
        apikey: string;
        model_name: string;
        provider: "openai" | "groq";
    };
    "bd-connection": {
        provider: string;
        schema?: string;  // Opcional, con valor predeterminado "public", convertido a minúsculas
        url: string;
        type: "postgres" | "mysql";  // Valor enumerado
    };
};

export const sqlCompletions = async (c: SqlCompletionValidatorType) => {
    const { query, type, sql, "ai-connection": aiConn, "bd-connection": bdConn } = c

    const embeddingModel = new OpenaiEmbedding({ apikey: aiConn.apikey })

    const vs = await create_vs_connection()

    const retriever = semanticFilterRetriever({
        vectorStore: vs,
        embedding: embeddingModel
    })

    const conf = {
        streamMode: "updates",
        recursionLimit: 12,
        configurable: {
            retriever,
            type,
            db: await create_connection(bdConn.type, bdConn.schema || "public", bdConn.url),
            model: ModelFactory.model(aiConn.provider, aiConn),
            args: {
                bdConn,
                aiConn
            }

        }
    }

    const inputs = {
        query,
        sql: sql || ""
    }

    // @ts-ignore
    return await workflow.stream(inputs, conf)
}

function getRandomChunkSize(): number {
    return Math.floor(Math.random() * 5) + 1;
}

export async function createChunks(content: string, node: string) {
    await sleep(60)
    const words = content.split(" ");
    let i = 0;

    while (i < words.length) {
        const chunkSize = getRandomChunkSize();
        const chunk = words.slice(i, i + chunkSize).join(" ");
        i += chunkSize;

        return {
            data: chunk,
            event: node,
        }
    }
}
