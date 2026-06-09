import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um email inválido'),
  password: z.string().min(1, 'Informe sua senha'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
