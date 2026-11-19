import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const loginSchema = z.object({
  email: z.email({ error: "El email no tiene un formato válido" }).trim().toLowerCase(),
  password: z.string().min(1, { error: "La contraseña es obligatoria" }),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, { error: "El nombre tiene que tener al menos 2 caracteres" }).max(80),
    email: z.email({ error: "El email no tiene un formato válido" }).trim().toLowerCase(),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, { error: `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres` })
      .max(128),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
