import { APIConfs } from "@/types/api-confs";
// import { Configurations } from "../../shared/interfaces/connections.interface";

export const configurations = () => {
    const configurations: APIConfs = { 
        "db-connection": [
            {
                provider: "mysql",
                schema: {
                    required: false,
                    placeholder: "public"
                },
                url: {
                    required: true,
                    placeholder: "mysql://myuser:mypassword@localhost:3306/mydatabase"
                }
            },
            {
                provider: "postgres",
                schema: {
                    required: true,
                    placeholder: "public"
                },
                url: {
                    required: true,
                    placeholder: "postgresql://myuser:mypassword@localhost:5432/mydatabase"
                },
            }
        ], 
        "ai-connection": [
            {
                provider: "Openai",
                model_names: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
                apikey: {
                    required: true,
                    placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                },
                temperature: {
                    required: false,
                    placeholder: 0,
                    default: 0
                }
            },
            // {
            //     provider: "Google",
            //     model_names: ["models/gemini-1.5-pro-exp-0801", "models/gemini-1.5-pro-latest"],
            //     apikey: {
            //         required: true,
            //         placeholder: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            //     },
            //     temperature: {
            //         required: false,
            //         placeholder: 0,
            //         default: 0
            //     }
            // },
            {
                provider: "Groq",
                model_names: ["llama3-70b-8192", "mixtral-8x7b-32768"],
                apikey: {
                    required: true,
                    placeholder: "gsk_cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                },
                temperature: {
                    required: false,
                    placeholder: 0,
                    default: 0
                }
            }
        ]
    }

    return { configurations }
}