import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'

import { configurations } from './controllers/confs.controller'
import { dbValidator, createDBConnection, dbConnection, tableInfo } from './controllers/create_db_connection'
import { aiValidator, createAIConnection } from './controllers/create_ai_connection'
import { sqlCompletionValidator, sqlCompletions } from './controllers/sql-completions.controller'

const app = new Hono()
app.get('/', (c) => {
  return c.json({ message: 'Hello AI!' })
})

const base = app.basePath('/v1')

app.use(prettyJSON())
app.use(cors({
  origin: "*",
}))

app.use('/v1/*', cors({
  origin: "*",
}))

app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
app.onError((err, c) => {
  console.log("api", err)
  return c.json({ error: err.message }, 502)
})

// Middleware para agregar cabeceras CSP
app.use('*', async (c, next) => {
  console.log("#".repeat(20))
  console.log("IP:", c.req.header("x-forwarded-for"))
  console.log("tableName:", c.req.header("x-table-vs"))
  console.log("cookie", c.req.header("cookie"))
  console.log("Timezone", c.req.header("cf-timezone"))
  console.log("City", c.req.header("cf-ipcity"))
  console.log("Country", c.req.header("cf-ipcountry"))
  console.log("#".repeat(20))
  // console.log("Body", await c.req.json())
  // console.log("Query", c.req.query())
  // console.log("Parameters", c.req.param())
  // console.log("#".repeat(20))
  c.res.headers.set('Content-Security-Policy', "default-src 'self'; frame-ancestors *;");
  await next();
});

base.get('/', (c) => {
  return c.json({ message: 'Hello AI!' })
})

base.get("confs", configurations)
base.post("table-info", dbConnection, tableInfo)
base.post("validate-db-connection", dbValidator, createDBConnection)
base.post("validate-ai-connection", aiValidator, createAIConnection)

base.post("sql-completions", sqlCompletionValidator, sqlCompletions)

export default app