import { zValidator } from "@hono/zod-validator";
import { Context } from "hono";
import { z } from "zod";
import { streamSSE } from "hono/streaming"

import { workflow } from "~/ai/graph";
import { create_connection } from "~/ai/db/engine.db";
import { semanticFilterRetriever } from "~/ai/rag/semantic-filter.rag";
import { create_vs_connection } from "~/ai/retriever";

import OpenaiEmbedding from "~/ai/models/embedding.model";
import ModelFactory from "~/ai/models";
import { GraphState } from "~/shared/interfaces/graph.interface";
import { getCookie } from "hono/cookie";

export const sqlCompletionValidator = zValidator("json", z.object({
    query: z.string(),
    type: z.enum(["completion", "explain", "execute"]).optional().default("completion"),
    sql: z.string().optional().default(""),
    "ai-connection": z.object({
        temperature: z.number().optional().default(0),
        apikey: z.string(),
        model_name: z.string().transform(str => str.toLocaleLowerCase()),
        provider: z.string().transform(str => str.toLocaleLowerCase()),
    }),
    "bd-connection": z.object({
        provider: z.string().transform(str => str.toLocaleLowerCase()),
        schema: z.string().optional().transform(str => str.toLocaleLowerCase()).default("public"),
        url: z.string(),
        type: z.enum(["postgres", "mysql"]),
    })
}))

export const sqlCompletions = async (c: Context) => {
    // @ts-ignore
    const { query, type, sql, "ai-connection": aiConn, "bd-connection": bdConn } = c.req.valid("json")

    const ck = getCookie(c, "vs_id") || c.req.header("x-table-vs")
    if (!ck) return c.json({ message: "Hubo un error al recibir la metadata. Conecta nuevamente tu base de datos."}, 400)

    const embeddingModel = new OpenaiEmbedding({ apikey: aiConn.apikey })
    
    const vs = await create_vs_connection(ck, embeddingModel)
    
    if (!vs) return c.json({ message: "Hubo un error al recibir la metadata. Conecta nuevamente tu base de datos."}, 400)

    const retriever = semanticFilterRetriever({
        vectorStore: vs,
        embedding: embeddingModel
    })
    const db = await create_connection(bdConn.type, bdConn.schema, bdConn.url)
    const conf = {
        streamMode: "updates",
        recursionLimit: 12,
        configurable: {
            retriever,
            type,
            db,
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
    const aiStream = await workflow.stream(inputs, conf)

    return streamSSE(c, async (stream) => {
        for await (const chunk of aiStream) {
            for (const [_, values] of Object.entries(chunk)) {
                const update = values as GraphState;
                const node = update.messages.at(-1)?.name || "update"
                const content = update.messages.at(-1).content as string;


                console.log(`Receiving update from node: ${node}\nContent: ${content}`);

                if (node !== "update") {
                    await sendChunks(content, stream, node)
                }else {
                    await stream.writeSSE({
                        data: content,
                        event: node,
                    });
                }
               
            }
        }
        await db.appDataSource.destroy()
    })
}

function getRandomChunkSize(): number {
    return Math.floor(Math.random() * 5) + 1;
}

async function sendChunks(content: string, stream: any, node: string) {
    const words = content.split(" ");
    let i = 0;

    while (i < words.length) {
        const chunkSize = getRandomChunkSize();
        const chunk = words.slice(i, i + chunkSize).join(" ");
        i += chunkSize;

        await stream.writeSSE({
            data: chunk,
            event: node,
        });

        await stream.sleep(25);
    }
}
