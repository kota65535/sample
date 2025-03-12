import { z } from 'zod'

const schema = z.object({
  ENV: z.string(),
  VERSION: z.string(),
  API_BASE_URL: z.string(),
})

export type Env = z.infer<typeof schema>

export const loadEnv = async (baseUrl?: string): Promise<Env> => {
  const response = await fetch(`${baseUrl ?? ''}/env.json`)
  const config = await response.json()
  return schema.parse(config)
}
