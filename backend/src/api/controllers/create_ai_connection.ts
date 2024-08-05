import { zValidator } from "@hono/zod-validator";
import { Context } from "hono";
import { z } from "zod";

export const aiValidator = zValidator("json", z.object({
    "ai-connection": z.object({
        temperature: z.number().optional().default(0),
        apikey: z.string(),
        model_name: z.string(),
        provider: z.string().transform(str => str.toLocaleLowerCase()),
    })
}))

import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';

export const createAIConnection = async (c: Context) => {
    // @ts-ignore
    const { "ai-connection": { model_name, ...args } } = c.req.valid("json")
    
    const openai = createOpenAI({
        apiKey: args.apikey
    })
    await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: "foo"
    });
    return c.json({ message: "Conexión establecida" })
}