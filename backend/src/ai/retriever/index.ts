import { z } from 'zod';
import { Document } from "@langchain/core/documents";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { similarity } from "ml-distance";

import { generateObject } from 'ai';

import chunkingTablesPrompt from "../prompts/chunking-tables.prompt";

const map_memory = new Map<string, MemoryVectorStore>()

const generate_documents = async (system: string, prompt: string, model: any) => await generateObject({
  model,
  schema: z.object({
    descriptions: z.array(z.string()).describe("Un array con las descripciones de las tablas")
  }),
  system,
  prompt
});


export const create_documents = async (id: string, db: any, model: any, embeddingModel: any) => {

  console.time("table_info")
  const texts = await db.getSchemaInfo()
  const tables = db.allTables.map(table => table.tableName)
  console.timeEnd("table_info")

  const system = chunkingTablesPrompt
    .replace("{table_info}", texts)
    .replace("{table_names}", `${tables}`)

  console.time("generate_documents")
  const { object: { descriptions } } = await generate_documents(system, `extrae los ${tables.length} documentos en la bd`, model)
  console.timeEnd("generate_documents")

  const documents = texts.split("\n--\n").map((sql, id) => new Document({
    pageContent: `${descriptions[id]}`,
    metadata: {
      sql,
      id
    }
  }))

  console.time("load_documents")
  await load_documents(id, documents, embeddingModel)
  console.timeEnd("load_documents")

};

export async function create_vs_connection(id: "local_mysql" | "local_postgres" | string, embeddingModel?: any) {
  return map_memory.get(id)

}

async function load_documents(id: string, documents: { pageContent: string, metadata: any }[], embeddingModel: any) {

  const vs = new MemoryVectorStore(embeddingModel, { similarity: similarity.pearson })

  await vs.addDocuments(documents)
  map_memory.set(id, vs)
}