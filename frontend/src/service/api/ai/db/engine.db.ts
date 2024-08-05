import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

type type = "mysql" | "postgres"
export const create_connection = async (t: type, schema: string, url: string) => {
    const datasource = new DataSource({
        type: t,
        url,
        schema
    });

    try {
        const db = await SqlDatabase.fromDataSourceParams({
            appDataSource: datasource
        });

        // @ts-ignore
        db.getSchemaInfo = async () => {
            const sqlText = await db.getTableInfo()
            const regex = /CREATE TABLE.*?;\s*/gs;
            const matches = sqlText.match(regex);

            if (matches) {
                return matches.map(match => match.trim()).join("\n--\n")
            }

            return sqlText
        }
        return db as any
    } catch (e: any) {
        throw new Error(e?.message)
    }

}

// const db = await create_connection("postgres", "test", "postgresql://usuario:password@url:5432/tabla")
// console.log(await db.getSchemaInfo())
/**
[
    ...las tablas se mostraran en un array
]
 */