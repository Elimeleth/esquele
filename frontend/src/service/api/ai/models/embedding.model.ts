import { NomicEmbeddings } from "@langchain/nomic";

import { createOpenAI } from "@ai-sdk/openai"
import { embed, embedMany } from 'ai';

type Embedding_name = 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
type Embedding = { model_name?: Embedding_name, apikey: string, dimension?: number }
export default class OpenaiEmbedding {
    model: any = new NomicEmbeddings()
    private is_production = process.env.NODE_ENV === "production"

    constructor(args: Embedding) {
        if (this.is_production) {
            const openai = createOpenAI({ apiKey: args.apikey })
            this.model = openai.embedding(args?.model_name || "text-embedding-3-large", {
                dimensions: args?.dimension || 1536
            })
        }
    }

    async embedDocuments(values: string[]) {
        if (this.is_production) {
            const { embeddings } = await embedMany({
                model: this.model,
                values
            })

            return embeddings

        }

        return await this.model.embedDocuments(values)
    }

    async embedQuery(value: string) {
        if (this.is_production) {
            const { embedding } = await embed({
                model: this.model,
                value
            })

            return embedding
        }

        return await this.model.embedQuery(value)

    }
}

// const e = new OpenaiEmbedding({ apikey: process.env.OPENAI_API_KEY })

// console.log(await e.embedQuery("foo"))
// console.log(await e.embedDocuments(["foo", "foo"]))