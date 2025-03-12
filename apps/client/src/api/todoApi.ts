import type { AppType } from "@sample/server/src";
import { hc } from 'hono/client'


const API_BASE_URL = 'http://localhost:3000';

const client = hc<AppType>(API_BASE_URL)


export const getTodos = async () => {
    const res = await client.todos.$get();
    const data = await res.json();
    return data;
}


export const getTodo = async (id: string) => {
    const res = await client.todos[":id"].$get({ param: { id } });
    const data = await res.json();
    return data;
}