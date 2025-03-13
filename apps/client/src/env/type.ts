import { z } from 'zod'

export const schema = z.object({
    ENV: z.string(),
    VERSION: z.string(),
    SERVER_API_URL: z.string(),
})

export type Env = z.infer<typeof schema>
