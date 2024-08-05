interface DBConnection {
    provider: string;
    schema: string;
    url: string;
    type: "postgres"|"mysql"
}

interface AIConnection {
    provider: string;
    model_name: string;
    apikey: string;
    temperature: number;
}

export interface AppConnection {
    "db-connection": DBConnection,
    "ai-connection": AIConnection,
}