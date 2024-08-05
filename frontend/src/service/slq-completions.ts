// import { apiURI } from "@/constants/api.const";
import { APISqlCompletionsParams, SqlCompletationState } from "@/types/api-sql-completion";
import { formatDialect as format, postgresql, mysql } from 'sql-formatter';
import { sqlCompletions } from "./api/api";
import { GraphState } from "./api/shared/interfaces/graph.interface";
import { createChunks } from "./api/api/controllers/sql-completions.controller";



type SubscribeFunc = {
    init: () => void;
    next: (args: Partial<SqlCompletationState>) => void;
    error: (message: string) => void;
}

const parseStreamData = (a: any): { event: string; eventUpdate: string; data: string } => {
    // const entries = chunk.split('\n\n').filter(entry => entry.trim() !== '');
    const { e, d } = a
    let event = '';
    let eventUpdate = '';
    let data = '';

    // entries.map(entry => {
    //     const [eventPart, ...dataPart] = entry.split('\n');
    //     const e = eventPart.replace('event:', '').trim();
    //     const d = dataPart.filter(line => line.startsWith('data:')) // Filtrar las líneas que comienzan con 'data:'
    //         .map(line => line.replace('data: ', ''))  // Eliminar 'data: ' de cada línea
    //         .join('\n');

    //     event = e;
    //     if (event == 'update') {
    //         eventUpdate = d;
    //     }
    //     if (e != 'update') {
    //         data += data.length > 0 ? ` ${d}` : d;
    //     }

    // });

    if (e == 'update') {
        eventUpdate = d;
    }
    if (e != 'update') {
        data += data.length > 0 ? ` ${d}` : d;
    }

    return { event, eventUpdate, data };
};


export const createSqlCompletion = async (params: APISqlCompletionsParams,
    subscribe: SubscribeFunc

) => {

    // const response = await fetch(`${apiURI}sql-completions`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             "x-table-vs": import.meta.env.VITE_X_TABLE_VS
    //         },
    //         body: JSON.stringify(params)
    //     });

    const iterable = await sqlCompletions(params as any)



    subscribe.init();

    // if (!response.ok) {
    //     console.log("calling error cb");
    //     subscribe.error((await response.json())?.message);


    //     return;
    // };


    // const reader = response.body?.getReader();
    // if (reader == null) return;
    // const decoder = new TextDecoder();


    // let done = false;
    let receivedText = '';
    let parsedData: any = {};

    for await (const chunk of iterable) {
        for (const [_, values] of Object.entries(chunk)) {
            const update = values as GraphState;
            const node = update.messages.at(-1)?.name || "update"
            const content = update?.messages.at(-1)?.content as string;
            console.log(`Receiving update from node: ${node}\nContent: ${content}`);

            if (node !== "update") {
                const { data, event } = await createChunks(content, node) as any
                receivedText += receivedText.length ? ` ${data}` : data;

                parsedData = parseStreamData({ e: event, d: receivedText })
                try {
                    parsedData['data'] = format(parsedData['data'], {
                        dialect: params["bd-connection"].provider == 'postgres' ? postgresql : mysql,
                        tabWidth: 4,
                        keywordCase: 'upper',
                        linesBetweenQueries: 2,
                    });

                } catch (_) { }
            } else {
                parsedData = parseStreamData({ e: node, d: content })
            }
            subscribe.next({
                ...parsedData,
                done: false,
            });

        }
    }
    subscribe.next({
        ...parsedData,
        done: false,
    });



    // while (!done) {
    //     // const { value, done: readerDone } = await reader.read();
    //     // done = readerDone;
    //     // const chunk = decoder.decode(value, { stream: true });

    //     // if (chunk.length == 0) continue;

    //     // receivedText += receivedText.length ? ` ${chunk}` : chunk;
    //     parsedData = parseStreamData(receivedText);
    //     if (parsedData.event == 'sql-craft') {
    //         try {
    //             parsedData['data'] = format(parsedData['data'], {
    //                 dialect: params["bd-connection"].provider == 'postgres' ? postgresql : mysql,
    //                 tabWidth: 4,
    //                 keywordCase: 'upper',
    //                 linesBetweenQueries: 2,
    //             });

    //         } catch (_) { }
    //     }
    //     subscribe.next({
    //         ...parsedData,
    //         done: false,
    //     });

    // }

    // subscribe.next({
    //     ...parsedData,
    //     done: false,
    // });

}

