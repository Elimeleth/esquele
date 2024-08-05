import { create_connection } from "../../ai/db/engine.db";
import { create_documents } from "../../ai/retriever";
import OpenaiEmbedding from "../../ai/models/embedding.model";
import ModelFactory from "../../ai/models";

type DbValidatorType = {
    "ai-connection": {
        temperature?: number;  // Opcional, con un valor predeterminado de 0
        apikey: string;
        model_name: string;
        provider: "openai"|"groq";
    };
    "bd-connection": {
        provider: string;
        schema?: string;  // Opcional, con un valor predeterminado de "public"
        url: string;
        type: "postgres" | "mysql";  // Tipo enumerado
    };
};

export const createDBConnection = async (c: DbValidatorType) => {
    const { "ai-connection": { provider, model_name, apikey }, "bd-connection": { type, schema, url }} = c

    const db = await create_connection(type, schema || "public", url)
    const embeddingModel = new OpenaiEmbedding({ apikey })
    await create_documents(db, ModelFactory.model(provider, { model_name, apikey }), embeddingModel)

    return { message: "Conexión establecida" }
}