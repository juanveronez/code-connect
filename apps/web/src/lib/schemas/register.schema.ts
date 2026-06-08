import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.string().min(1, 'Informe seu email').email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
