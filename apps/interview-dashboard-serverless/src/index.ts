import { Hono } from 'hono'
import { Env } from './config/env'
import dataRoutes from './routes/dataRoute'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '/api/*',
  cors({
    origin: ['https://interview-vue.pages.dev', 'http://localhost:5173'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE'],
    maxAge: 600,
    credentials: true,
  }),
)

app.route('/', dataRoutes)

export default app
