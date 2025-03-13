import { Hono } from 'hono'
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import todoRoute from './routes/todo'
import healthRoute from "./routes/health";

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Routes
const routes = app
    .route('/todos', todoRoute)
    .route('/health', healthRoute)

export default {
    port: Number(process.env.PORT) ?? 3000,
    fetch: app.fetch,
}

export type AppType = typeof routes
