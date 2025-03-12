import {Hono} from 'hono'

const app = new Hono()

const healthRoute = app
    .get('/', (c) => {
        return c.json({
            message: 'TODO API is running',
            version: '1.0.0'
        })
    })


export default healthRoute

