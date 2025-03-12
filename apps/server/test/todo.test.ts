import { beforeEach, describe, expect, it } from 'bun:test'
import { hc } from 'hono/client'
import { AppType } from 'src/'
import { PrismaClient } from "@sample/db/prisma-client";

const client = hc<AppType>('http://localhost:3001/')

const prisma = new PrismaClient()

describe('health check', () => {
    it('should return 200 Response', async () => {
        const res = await client.health.$get()
        const body = await res.json()
        expect(res.status).toBe(200)
        expect(body.version).toBe("1.0.0")
    })
})

describe('TODO', () => {
    beforeEach(() => {
        prisma.todo.deleteMany({})
    });

    it('CRUD operation works', async () => {
        // Create
        let id
        {
            const res = await client.todos.$post({
                json: {
                    title: "test",
                    description: "desc"
                }
            })
            const status = res.status
            const body = await res.json()

            expect(status).toBe(201)
            expect(body.title).toBe("test")
            expect(body.description).toBe("desc")
            id = body.id
        }
        // Get list
        {
            const res = await client.todos.$get()
            const status = res.status
            const body = await res.json()

            expect(status).toBe(200)
            expect(body.todos.length).toBe(1)
            expect(body.todos[0].title).toBe("test")
            expect(body.todos[0].description).toBe("desc")
        }
        // Get single
        {
            const res = await client.todos[':id'].$get({ param: { id } })
            const status = res.status
            const body = await res.json()

            expect(status).toBe(200)
            expect(body.title).toBe("test")
            expect(body.description).toBe("desc")
        }
        // Update
        {
            const res = await client.todos[':id'].$put({
                param: { id },
                json: {
                    title: "test2",
                    description: "desc2"
                }
            })
            const status = res.status
            const body = await res.json()

            expect(status).toBe(200)
            expect(body.title).toBe("test2")
            expect(body.description).toBe("desc2")
        }
        // Get single
        {
            const res = await client.todos[':id'].$get({ param: { id } })
            const status = res.status
            const body = await res.json()

            expect(status).toBe(200)
            expect(body.title).toBe("test2")
            expect(body.description).toBe("desc2")
        }
        // Delete
        {
            const res = await client.todos[':id'].$delete({ param: { id } })
            const status = res.status
            expect(status).toBe(204)
        }
        // Get single
        {
            const res = await client.todos[':id'].$get({ param: { id } })
            const status = res.status

            expect(status).toBe(404)
        }
    })
})
