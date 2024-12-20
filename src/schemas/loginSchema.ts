import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"), // Valida formato de email
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});