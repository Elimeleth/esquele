import { createOpenAI } from "@ai-sdk/openai"


type Provider = "openai"
type Args = {
    model_name: string,
    apikey: string,
}
export default class ModelFactory {
    static model(provider: Provider, args: Args) {
        return createOpenAI({ apiKey: args.apikey })(args.model_name)
    }
}

// const model = ModelFactory.model("openai", { modelName: "", apikey: " " })