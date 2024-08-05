type AiValidatorType = {
    "ai-connection": {
        temperature?: number;
        apikey: string;
        model_name: string;
        provider: string;
    }
};

import { createOpenAI } from '@ai-sdk/openai';
import { embed, generateText } from 'ai';

export const createAIConnection = async (c: AiValidatorType) => {
    // @ts-ignore
    const { "ai-connection": { model_name, ...args } } = c
    console.log({ model_name, args })
    try {
        if (args.provider === "openai") {
            const openai = createOpenAI({
                apiKey: args.apikey
            })
            await embed({
                model: openai.embedding('text-embedding-3-small'),
                value: "foo"
            });
        } else if (args.provider === "groq") {
            const groq = createOpenAI({
                baseURL: 'https://api.groq.com/openai/v1',
                apiKey: args.apikey,
            });

            await generateText({
                model: groq(model_name),
                prompt: "hello world"
            });

        }else {
            throw Error("Model not supported")
        }
        return { message: "Conexión establecida" }
    } catch (error) {
        console.log({ error })
        return null
    }

    
}