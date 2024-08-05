interface SchemaConfig {
    required: boolean;
    placeholder: string;
    default?: string;
}

interface UrlConfig {
    required: boolean;
    placeholder: string;
    default?: string;
}

interface DBConnection {
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

interface AIConnection {
    provider: string;
    model_names: string[];
    apikey: ApikeyConfig;
    temperature: TemperatureConfig;
}

export interface Configurations {
    "db-connection": DBConnection[];
    "ai-connection": AIConnection[];
}