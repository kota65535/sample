import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "../db";

const app = new Hono()

// Enhanced validation schemas
const todoSchema = z.object({
    title: z.string().max(100, 'Title must be 100 characters or less'),
    description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
    completed: z.boolean().default(false)
})

const todoUpdateSchema = z.object({
    title: z.string().max(100, 'Title must be 100 characters or less'),
    description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
    completed: z.boolean().default(false)
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
})

const todoIdSchema = z.object({
    id: z.string()
})

const todoRoute = app
    // Get Todos
    .get('/', async (c) => {
        let todos = await getTodos();
        try {
            todos = await getTodos();
        } catch (error) {
            console.error(error)
            throw new HTTPException(500);
        }
        return c.json({ todos })
    })
    // Get Single Todo
    .get('/:id', zValidator('param', todoIdSchema), async (c) => {
        const { id } = c.req.valid('param')
        let todo
        try {
            todo = await getTodo(id);
        } catch (error) {
            console.error(error)
            throw new HTTPException(500);
        }
        if (!todo) {
            throw new HTTPException(404);
        }
        return c.json(todo)
    })
    // Create Todo
    .post('/', zValidator('json', todoSchema), async (c) => {
        const data = c.req.valid('json')
        let todo
        try {
            todo = await createTodo(data);
        } catch (error) {
            console.error(error)
            throw new HTTPException(500);
        }
        return c.json(todo, 201)
    })
    // Update Todo
    .put('/:id', zValidator('param', todoIdSchema), zValidator('json', todoUpdateSchema), async (c) => {
        const { id } = c.req.valid('param')
        const data = c.req.valid('json')
        let todo
        try {
            todo = await updateTodo(id, data)
        } catch (error) {
            console.error(error)
            throw new HTTPException(500);
        }
        return c.json(todo, 200)
    })
    // Delete Todo
    .delete('/:id', zValidator('param', todoIdSchema), async (c) => {
        const { id } = c.req.valid('param')
        try {
            await deleteTodo(id)
        } catch (error) {
            console.error(error)
            throw new HTTPException(500);
        }
        return c.body(null, 204)
    })

export default todoRoute

