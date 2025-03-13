import type { AppType } from "@sample/server/src";
import {hc} from 'hono/client'

export type ServerApiClientType = ReturnType<typeof hc<AppType>>

export type ApiClients = {
    server: ServerApiClientType
}
