// import { createGoogleGenerativeAI } from "@ai-sdk/google"
// import { createMistral } from "@ai-sdk/mistral"
import { createOpenAI } from "@ai-sdk/openai"


type Provider = "openai"|"groq" //"google"|"mistral"|
type Args = {
    model_name: string,
    apikey: string,
}
export default class ModelFactory {
    static model(provider: Provider, args: Args): any {
        switch (provider) {
            // case "google":
            //     return createGoogleGenerativeAI({ apiKey: args.apikey })(args.model_name, {
            //         safetySettings: [
            //             { category: "HARM_CATEGORY_HARASSMENT", threshold: 'BLOCK_NONE' }
            //           ],
            //     })
            // case "mistral":
            //     return createMistral({ apiKey: args.apikey })(args.model_name)
            case "openai":
                return createOpenAI({ apiKey: args.apikey })(args.model_name)
            case "groq":
                const groq = createOpenAI({
                    baseURL: 'https://api.groq.com/openai/v1',
                    apiKey: args.apikey,
                });

                return groq(args.model_name)

        }
    }
}

// const model = ModelFactory.model("google", { modelName: "", apikey: " " })