interface SchemaConfig {
    required: boolean;
    placeholder: string;
}

interface UrlConfig {
    required: boolean;
    placeholder: string;
}

export interface DBConnection {
    provider: string;
    schema: SchemaConfig;
    url: UrlConfig;
}

interface ApikeyConfig {
    required: boolean;
    placeholder: string;
}

interface TemperatureConfig {
    required: boolean;
    placeholder: number;
    default: number;
}

export interface AIConnection {
    provider: string;
    model_names: string[];
    apikey: ApikeyConfig;
    temperature: TemperatureConfig;
}

export interface APIConfs {
    "db-connection": DBConnection[];
    "ai-connection": AIConnection[];
}

export interface APIConfsResponse {
    configurations: APIConfs;
}