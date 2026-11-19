import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { AuthCard } from "../components/AuthCard";
import { OrDivider, SocialButtons } from "../components/SocialButtons";
import { Alert } from "../components/ui/Alert";
import { FormField } from "../components/ui/FormField";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { signUp } from "../lib/auth-client";
import { translateAuthError } from "../lib/auth-errors";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";

export const Register = () => {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUser();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  if (!isPending && user) return <Navigate to="/" replace />;

  const onSubmit = async ({ name, email, password }: RegisterFormValues) => {
    setServerError("");
    const { error } = await signUp.email({ name, email, password });
    if (error) {
      setServerError(translateAuthError(error));
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Con una cuenta podés explorar el catálogo completo."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-medium text-amber-400 hover:underline">
            Ingresá
          </Link>
        </>
      }
    >
      {serverError && <Alert>{serverError}</Alert>}
      <SocialButtons redirectTo="/" onError={setServerError} />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Nombre" htmlFor="name" error={errors.name?.message}>
          <input id="name" autoComplete="name" className="input" aria-invalid={Boolean(errors.name)} {...register("name")} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>
        <FormField label="Contraseña" htmlFor="password" error={errors.password?.message} hint="Mínimo 8 caracteres">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>
        <FormField label="Repetir contraseña" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </FormField>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
    </AuthCard>
  );
};
