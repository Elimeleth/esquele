import { z } from 'zod';
import { Document } from "@langchain/core/documents";
// import { DataSourceOptions } from "typeorm";
// import { TypeORMVectorStore } from "@langchain/community/vectorstores/typeorm";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { similarity } from "ml-distance";

import { generateObject } from 'ai';

import chunkingTablesPrompt from "../prompts/chunking-tables.prompt";

let memory: MemoryVectorStore

const generate_documents = async (system: string, prompt: string, model: any) => await generateObject({
  model,
  schema: z.object({
    descriptions: z.array(z.string()).describe("Un array con las descripciones de las tablas")
  }),
  system,
  prompt
});


export const create_documents = async (db: any, model: any, embeddingModel: any) => {
  console.time("table_info")
  const texts = await db.getSchemaInfo()
  
  console.timeEnd("table_info")
  const tables = db.allTables.map((table: any)=> table.tableName)
  console.log(tables)
  const system = chunkingTablesPrompt
    .replace("{table_info}", texts)
    .replace("{table_names}", `${tables}`)

    console.time("generate_documents")
    const { object: { descriptions } } = await generate_documents(system, `extrae los ${tables.length} documentos en la bd`, model)
    console.timeEnd("generate_documents")

    console.log(descriptions.length, tables.length)
    const documents = texts.split("\n--\n").map((sql: string, id: number) => new Document({
      pageContent: `${descriptions[id]}`,
      metadata: {
        sql,
        id
      }
    }))
    console.log(documents)
    await load_documents(documents, embeddingModel)

};

export async function create_vs_connection() {
  // const args = {
  //   postgresConnectionOptions: {
  //     type: "postgres",
  //     url: process.env.POSTGRES_VS_URL,
  //   } as DataSourceOptions,
  // };

  // const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
  //   embeddingModel,
  //   {
  //     ...args,
  //     tableName: tableName //|| process.env.TABLE_NAME_VS
  //   }
  // );

  // await typeormVectorStore.ensureTableInDatabase();

  // return typeormVectorStore

  return memory
  
}

async function load_documents(documents: { pageContent: string, metadata: any }[], embeddingModel: any) {
  memory = new MemoryVectorStore(embeddingModel, { similarity: similarity.pearson })

  // await vs.addDocuments(documents.map(doc => new Document({
  //   pageContent: doc.pageContent,
  //   metadata: doc.metadata
  // })));
  await memory.addDocuments(documents)
}