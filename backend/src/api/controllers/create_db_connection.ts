import { zValidator } from "@hono/zod-validator";
import { Context } from "hono";
import { z } from "zod";
import { create_connection } from "~/ai/db/engine.db";

import { setCookie, getCookie } from "hono/cookie"
import { generateRandomTableName } from "~/shared/utils/createTableName.fn";
import { create_documents } from "~/ai/retriever";
import OpenaiEmbedding from "~/ai/models/embedding.model";
import ModelFactory from "~/ai/models";

export const dbValidator = zValidator("json", z.object({
    "ai-connection": z.object({
        temperature: z.number().optional().default(0),
        apikey: z.string(),
        model_name: z.string().transform(str => str.toLocaleLowerCase()),
        provider: z.string().transform(str => str.toLocaleLowerCase()),
    }),
    "bd-connection": z.object({
        provider: z.string().transform(str => str.toLocaleLowerCase()),
        schema: z.string().optional().default("public"),
        url: z.string(),
        type: z.enum(["postgres","mysql"]),
    })
}))

export const createDBConnection = async (c: Context) => {
    // @ts-ignore
    const { "ai-connection": { provider, model_name, apikey }, "bd-connection": { type, schema, url }} = c.req.valid("json")

    let ck = getCookie(c, "vs_id") || c.req.header("x-table-vs")
    
    const db = await create_connection(type, schema, url)
    
    if (!ck) {
        if (!url.includes("localhost")) {
            ck = generateRandomTableName()
        }else {
            ck = type === "postgres" 
            ? "local_postgres" : type === "mysql" 
            ? "local_mysql" : generateRandomTableName()
        }
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1)

        setCookie(c, "vs_id", ck, { httpOnly: true, sameSite: "Strict", secure: true, expires: expireDate })
        c.res.headers.set("x-table-vs", ck)
        
        const embeddingModel = new OpenaiEmbedding({ apikey })
        await create_documents(ck, db, ModelFactory.model(provider, { model_name, apikey }), embeddingModel)

    }
    await db.appDataSource.destroy()
    return c.json({ message: "Conexión establecida", vs_id: ck })
}

// ---

export const dbConnection = zValidator("json", z.object({
    "bd-connection": z.object({
        provider: z.string().transform(str => str.toLocaleLowerCase()),
        schema: z.string().optional().default("public"),
        url: z.string(),
        type: z.enum(["postgres","mysql"]),
    })
}))

export const tableInfo = async (c: Context) => {
    // @ts-ignore
    const { "bd-connection": { type, schema, url }} = c.req.valid("json")

    const db = await create_connection(type, schema, url)
    const tableInfo = db.allTables
    await db.appDataSource.destroy()
    return c.json({ tableInfo })
}