import { createOpenAI } from "@ai-sdk/openai"
import { embed, embedMany } from 'ai';

type Embedding_name = 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
type Embedding = { model_name?: Embedding_name, apikey: string, dimension?: number }
export default class OpenaiEmbedding {
    model:any

    constructor(args: Embedding) {
        const openai = createOpenAI({ apiKey: args.apikey })
        this.model = openai.embedding(args?.model_name || "text-embedding-3-large", {
            dimensions: args?.dimension || 1536
        })
    }

    async embedDocuments(values: string[]) {
        const { embeddings } = await embedMany({
            model: this.model,
            values
        })

        return embeddings
    }

    async embedQuery(value: string) {
        const { embedding } = await embed({
            model: this.model,
            value
        })

        return embedding

    }
}

// const e = new OpenaiEmbedding({ apikey: process.env.OPENAI_API_KEY })

// console.log(await e.embedQuery("foo"))
// console.log(await e.embedDocuments(["foo", "foo"]))