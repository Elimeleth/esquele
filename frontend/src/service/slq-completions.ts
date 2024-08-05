import { formatDialect as format, postgresql, mysql } from 'sql-formatter';
import { apiURI } from "@/constants/api.const";
import { XTABLEVSHEADER, XTABLEVSITEMSTORAGE } from "@/constants/platform.const";
import { APISqlCompletionsParams, SqlCompletationState } from "@/types/api-sql-completion";



type SubscribeFunc = {
    init: () => void;
    next: (args: Partial<SqlCompletationState>) => void;
    error: (message: string) => void;
}

const parseStreamData = (chunk: string): { event: string; eventUpdate: string; data: string } => {
    const entries = chunk.split('\n\n').filter(entry => entry.trim() !== '');
    let event = '';
    let eventUpdate = '';
    let data = '';

    entries.map(entry => {
        const [eventPart, ...dataPart] = entry.split('\n');
        const e = eventPart.replace('event:', '').trim();
        const d = dataPart.filter(line => line.startsWith('data:')) // Filtrar las líneas que comienzan con 'data:'
            .map(line => line.replace('data: ', ''))  // Eliminar 'data: ' de cada línea
            .join('\n');

        event = e;
        if (event == 'update') {
            eventUpdate = d;
        }
        if (e != 'update') {
            data += data.length > 0 ? ` ${d}` : d;
        }

    });

    return { event, eventUpdate, data };
};


export const createSqlCompletion = async (params: APISqlCompletionsParams,
    subscribe: SubscribeFunc

) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (localStorage.getItem(XTABLEVSITEMSTORAGE)) {
        headers[XTABLEVSHEADER.toLowerCase()] = localStorage.getItem(XTABLEVSITEMSTORAGE)!;
    }

    try {
        const response = await fetch(`${apiURI}sql-completions`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify(params)
            });



        subscribe.init();
        console.log("response ok", response.ok, response.status);

        if (!response.ok) {
            try {
                subscribe.error((await response.json())?.message);
            } catch (error) {
                subscribe.error("Al parecer algo ha ido muy mal.");
            }

            return;
        };


        const reader = response.body?.getReader();
        if (reader == null) return;
        const decoder = new TextDecoder();


        let done = false;
        let receivedText = '';
        let parsedData: any = {};



        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk.length == 0) continue;



            receivedText += receivedText.length ? ` ${chunk}` : chunk;
            parsedData = parseStreamData(receivedText);
            if (params.type === 'completion' && !['update', 'sql-craft'].includes(parsedData.event.toLowerCase())) {
                await reader.cancel()
                done = true;
                return;
            }
            if (parsedData.event == 'sql-craft') {
                try {
                    parsedData['data'] = format(parsedData['data'], {
                        dialect: params["bd-connection"].provider == 'postgres' ? postgresql : mysql,
                        tabWidth: 4,
                        keywordCase: 'upper',
                        linesBetweenQueries: 2,
                    });

                } catch (_) { }
            }
            subscribe.next({
                ...parsedData,
                done: false,
            });

        }

        subscribe.next({
            ...parsedData,
            done: true,
        });
    } catch (error: any) {
        subscribe.error('Algo ha ido muy mal')
    }

}

