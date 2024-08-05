import "dotenv/config"
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

type type = "mysql"|"postgres"
export const create_connection = async (t: type, schema: string, url: string) => {
    let datasource = undefined
    const regex = /^(?<protocol>\w+):\/\/(?:(?<username>[\w%]+)(?::(?<password>[^@]+))?@)?(?<host>[^:/]+)(?::(?<port>\d+))?(?:\/(?<database>[\w\d_]+))?$/;
    const match = url.match(regex);
    
    if (match) {
        const { protocol, username, password, host, port, database } = match.groups;
        datasource = new DataSource({
            type: t,
            host,
            port: +port,
            username,
            password,
            database
        });
    } else {
        datasource = new DataSource({
            type: t,
            url
        });
    }

    if (t === "postgres") datasource.setOptions({
        schema
    })

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
    } catch (e) {
        throw new Error(e?.message)
    }

}

// const db = await create_connection("mysql", "public", "mysql://user:root@localhost:3307/ecommerce")
// console.log(await db.allTables)
/**
[
    ...las tablas se mostraran en un array
]
 */