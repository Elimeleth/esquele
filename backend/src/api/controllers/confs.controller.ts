import { Context } from "hono";
import { Configurations } from "~/shared/interfaces/connections.interface";

export const configurations = async (c: Context) => {
    const configurations: Configurations = { 
        "db-connection": [
            {
                provider: "mysql",
                schema: {
                    required: false,
                    placeholder: "public",
                    default: "public"
                },
                url: {
                    required: true,
                    placeholder: "mysql://myuser:mypassword@localhost:3306/mydatabase",
                    default: "mysql://user:root@localhost:3307/ecommerce"
                }
            },
            {
                provider: "postgres",
                schema: {
                    required: true,
                    placeholder: "public",
                    default: "public"
                },
                url: {
                    required: true,
                    placeholder: "postgresql://myuser:mypassword@localhost:5432/mydatabase",
                    default: "postgresql://user:root@localhost:5433/ecommerce"
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
            }
        ]
    }

    return c.json({ configurations })
}