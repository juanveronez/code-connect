import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Informe seu email ou usuário'),
  password: z.string().min(1, 'Informe sua senha'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
