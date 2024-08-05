import { RunnableConfig } from "@langchain/core/runnables";
import { START, END, StateGraph, StateGraphArgs } from "@langchain/langgraph"
import { generateObject, generateText } from "ai";
import { sqlWriterPrompt, executePrompt, generateFeedbackPrompt, explainSqlPrompt, discriminatorPrompt } from "../prompts"

import { QuerySqlTool } from "langchain/tools/sql";
import { z } from "zod";

import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import { GraphState } from "~/shared/interfaces/graph.interface";
import { sleep } from "~/shared/utils/sleep.fn";

/*
    LangGraph va almacenando los estados previos con ello hacemos uso de un StreamingSSE
*/
const graphState: StateGraphArgs<GraphState>["channels"] = {
    messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
    },
    retries: {
        value: (x: number, y?: number) => (y ? y : x),
        default: () => 0,
    },
    maxRetries: {
        value: (x: number, y?: number) => (y ? y : x),
        default: () => 1,
    },
    query: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
    sql: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
    feedback: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
    context: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
    error: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
    result: {
        value: (x: string, y?: string) => (y ? y : x),
        default: () => "",
    },
};

/*
    Validamos de entrada el tipo de interacción que tiene el usuario

    agent: Solo si desea crear una query | Agent hace un pequeño Rag-Retrieval para extraer la metadata relevante (TABLAS SQL)
    sql-exec: Solo para ejecutar directamente una consulta Sql (SE VALIDA QUE SOLO SEA QUERY-SELECT)
    explain: Para explicar una Query-Select
*/
async function validateType(state: GraphState, conf: RunnableConfig) {
    const query = state.query
    const { type, model } = conf.configurable;

    if (type === "completion") {
        const { object: { intention }} = await generateObject({
            model,
            prompt: query,
            schema: z.object({
                intention: z.enum(["completion", "execute"]).describe("Execute: Es una sql pura | Completion: Es una consulta con lenguaje natural")
            }),
            system: discriminatorPrompt.replace("{query}", query)
        })
        console.log({ intention })
        return intention === "completion" ? "agent" : "sql_exec"
    }
    else if (type === "execute") return "sql_exec"
    else if (type === "explain") return "explain_sql"
    return "agent"
}

//#----------------------------------------
/*
    En el configurable ya esta precargado un retrieval semantico, quiere decir que extrae datos relevantes cuando se le pasa un input
*/
async function agent(state: GraphState, conf: RunnableConfig): Promise<Partial<GraphState>> {
    await sleep(500)
    const query = state.query
    const { retriever, db, model } = conf.configurable
    const tables = db.allTables

    const { object: { tablenames } } = await generateObject({
        model,
        system: `Basado en las siguientes tablas de una base de datos ${tables} debes retornar solo las tablas relevantes a la consulta del usuario`,
        prompt: `Cuales tablas deberia usar para esta consulta: ${query}`,
        schema: z.object({
            tablenames: z.string().describe("Entrega las tablas relavantes separadas por comas")
        })
    })

    let context = await retriever.invoke(tablenames) as Document[]
    if (!context.length) context = await retriever.invoke(query) as Document[]
    const ctx_str = context.map(ctx => `${ctx.pageContent}\n${ctx.metadata.sql}\n`).join("\n")
    
    return {
        messages: [new AIMessage({ name: "update", content: "Obteniendo la metadata necesaria" })],
        context: ctx_str
    }
}
//#----------------------------------------

/*
    Se valida y se limpia cualquier doble slash que tenga la sql por experiencias previas :)
*/
function cleanAndValidateSQL(sql: string) {
    // Eliminar barras invertidas
    const cleanedSql = sql.replace(/\\/g, '');

    // Palabras prohibidas (todas las que no son SELECT)
    const forbidden = [
        'insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate', 'exec',
        'execute', 'merge', 'call', 'declare', 'set', 'grant', 'revoke', 'commit',
        'rollback', 'savepoint', 'begin', 'end'
    ];

    // Validar que la consulta no contenga palabras prohibidas
    for (const dl of forbidden) {
        if (cleanedSql.toLowerCase().includes(dl)) {
            throw new Error(`${dl} is forbidden in query SELECTS`);
        }
    }

    // Validar que la consulta sea solo una instrucción SELECT
    if (!/^(select|SELECT)\s+/i.test(cleanedSql.trim())) {
        throw new Error("Only SELECT queries are allowed");
    }

    return cleanedSql;
}

//#----------------------------------------
/*
    SqlCraft: Su función es la de crear la query-select tomando en cuenta el contexto extraido por el nodo "agent"
*/
async function sqlCraft(state: GraphState, conf: RunnableConfig): Promise<Partial<GraphState>> {
    await sleep(500)
    const query = state.query
    const context = state.context
    const feedback = state.feedback || ""
    let error = state?.error || ""
    let sql = state?.sql || ""

    const retries = state.retries;
    const maxRetries = state.maxRetries;

    const { db, model, args: { bdConn: { schema, type } } } = conf.configurable
    if (retries > maxRetries) {
        return {
            messages: [new AIMessage({ name: "update", content: "No se pudo corregir la sql dado que el sistema alcanzo el maximo de intentos disponibles" })]
        }
    }
    
    try {

        // Se agregan todas las variables necesarias al prompt
        const system = sqlWriterPrompt
            .replace("{engine}", type)
            .replace("{schema}", schema || "")
            .replace("{table_info}", context)
            .replace("{table_names}", db.allTables.map(table => table.tableName))
            .replace("{feedback}", feedback)

        const { object: { sql: content } } = await generateObject({
            system,
            prompt: `Extrae la consulta sql sobre esta query: ${query}`,
            schema: z.object({
                sql: z.string().describe("Extrae la sql")
            }),
            model,
        })

        sql = cleanAndValidateSQL(content)
        
    } catch (error) {
        return {
            error: error?.message,
            sql,
            messages: [new AIMessage({ name: "update", content: "Ha ocurrido un error al intentar crear la query-select" })]
        }
    }

    return {
        error: "none",
        sql,
        messages: [new AIMessage({ name: "sql-craft", content: sql })]
    }
}

//#----------------------------------------
/*
    SqlExec: Su función es la de ejecutar la query-select 
*/
async function sqlExec(state: GraphState, conf: RunnableConfig): Promise<Partial<GraphState>> {
    await sleep(500)

    const { db, model } = conf.configurable
    const query = state.query
    let result = state.result
    const sql = state.sql
    const retries = state.retries;
    const maxRetries = state.maxRetries;

    if (retries > maxRetries) {
        return {
            messages: [new AIMessage({ name: "update", content: "No se pudo corregir la sql dado que el sistema alcanzo el maximo de intentos disponibles" })]
        }
    }

    let content = ""

    try {
        const executor = new QuerySqlTool(db)
        result = await executor.invoke(cleanAndValidateSQL(sql))
        if (result.toLocaleLowerCase().includes("queryfailederror")) throw Error(result)

        const system = executePrompt
            .replace("{result}", result)
            .replace("{sql}", sql)

        const { text } = await generateText({
            system,
            prompt: `Esta fue la consulta: ${query}`,
            model,
        })

        content = text
    } catch (error) {
        return {
            error: error?.message,
            feedback: "none",
            messages: [new AIMessage({ name: "update", content: "Se encontraron errores en la query-select" })]
        }
    }

    return {
        result,
        error: "none",
        feedback: "none",
        messages: [new AIMessage({ name: "sql-executed", content })],
        sql
    }
}
//#----------------------------------------


//#----------------------------------------
/*
    Validator: Valida si no se pudo ejecutar la sql y ejecuta los cambios necesarios
*/
async function validatorError(state: GraphState, _: RunnableConfig) {
    const error = state?.error !== "none" ? String(state?.error) : null
    const retries = state.retries
    const maxRetries = state.maxRetries

    if (retries > maxRetries) return END
    if (error && error?.includes("RetryError")) return END
    else if (error) return "generate_feedback"
    return END
}
//#----------------------------------------

//#----------------------------------------
/*
    Validator: Valida si no se pudo ejecutar la sql y ejecuta los cambios necesarios
*/
async function validatorFeedback(state: GraphState, _: RunnableConfig) {
    const feedback = state?.feedback !== "none" ? state?.feedback : null

    if (feedback) return "sql_exec"
    return END
}
//#----------------------------------------

//#----------------------------------------
/*
    generateFeedback: 
*/
async function generateFeedback(state: GraphState, conf: RunnableConfig): Promise<Partial<GraphState>> {
    await sleep(500)

    const query = state.query
    let feedback = state?.feedback !== "none" ? state?.feedback : null
    const sql = state.sql
    const error = state.error
    const retries = state.retries

    const { model, db } = conf.configurable

    const system = generateFeedbackPrompt
        .replace("{context}", error)
        .replace("{question}", query)
        .replace("{sql}", sql)
        .replace("{feedback}", feedback)
        .replace("{table_info}", await db.getSchemaInfo())

    const { text } = await generateText({
        system,
        prompt: `Genera feedback para corregir la query`,
        model,
    })

    feedback = text
    
    return {
        error: "none",
        retries: retries+1,
        feedback,
        messages: [new AIMessage({ name: "update", content: "Generando sugerencias para correción de errores" })]
    }

}
//#----------------------------------------

//#----------------------------------------
/*
    explainSql: 
*/
async function explainSql(state: GraphState, conf: RunnableConfig): Promise<Partial<GraphState>> {
    const sql = state.sql

    const { model } = conf.configurable

    const system = explainSqlPrompt
        .replace("{sql}", sql)

    const { text } = await generateText({
        system,
        prompt: `Explica la sql`,
        model,
    })

    return {
        error: "none",
        feedback: "none",
        messages: [new AIMessage({ name: "explain-sql", content: text })]
    }

}
//#----------------------------------------



const graph = new StateGraph({
    channels: graphState
})

graph
    .addNode("agent", agent) // Note: RAG Based, Se encarga de extraer la información necesaria.
    .addNode("sql_craft", sqlCraft) // Note: Crea el Sql con la información extraida.
    .addNode("sql_exec", sqlExec)
    .addNode("generate_feedback", generateFeedback) // Note: Genera Feedback para sugerir cambios.
    .addNode("explain_sql", explainSql) // Note: Explica la sql.
    .addConditionalEdges(START, validateType)
    .addEdge("agent", "sql_craft")
    .addConditionalEdges("sql_craft", validatorFeedback)
    .addConditionalEdges("sql_exec", validatorError)
    .addEdge("generate_feedback", "sql_craft")
    .addEdge("explain_sql", END)

export const workflow = graph.compile()