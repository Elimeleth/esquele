interface DBConnection {
    provider: string;
    schema: string;
    url: string;
    type: "postgres" | "mysql"
}
interface AIConnection {
    provider: string;
    model_name: string;
    apikey: string;
    temperature?: number;
}

export interface DBConnectionParams {
    provider: string;
    schema: string;
    url: string;
    type: "postgres" | "mysql"
}

export interface AIConnectionParams {
    provider: string;
    model_name: string;
    apikey: string;
}

export interface APIConnection {
    "db-connection": DBConnection,
    "ai-connection": AIConnection,
}