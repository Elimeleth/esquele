import "dotenv/config"
import app from "./api"
import { serve } from "@hono/node-server"


const port = Number(+process.env.PORT)
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
