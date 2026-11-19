import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/AuthCard";
import { OrDivider, SocialButtons } from "../components/SocialButtons";
import { Alert } from "../components/ui/Alert";
import { FormField } from "../components/ui/FormField";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { signIn } from "../lib/auth-client";
import { translateAuthError } from "../lib/auth-errors";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

const OAUTH_ERROR_MESSAGE = "No se pudo iniciar sesión con Google o GitHub. Probá de nuevo.";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isPending } = useCurrentUser();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
  const [serverError, setServerError] = useState(searchParams.get("error") ? OAUTH_ERROR_MESSAGE : "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  if (!isPending && user) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    const { error } = await signIn.email(values);
    if (error) {
      setServerError(translateAuthError(error));
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthCard
      title="Ingresar"
      subtitle="Entrá con tu email, Google o GitHub."
      footer={
        <>
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="font-medium text-amber-400 hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      {serverError && <Alert>{serverError}</Alert>}
      <SocialButtons redirectTo={redirectTo} onError={setServerError} />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
        <FormField label="Contraseña" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </AuthCard>
  );
};
