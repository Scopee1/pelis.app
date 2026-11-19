const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email o contraseña incorrectos",
  USER_ALREADY_EXISTS: "Ya existe una cuenta con ese email",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ya existe una cuenta con ese email",
  PASSWORD_TOO_SHORT: "La contraseña es demasiado corta",
  INVALID_EMAIL: "El email no es válido",
  PROVIDER_NOT_FOUND: "Ese método de inicio de sesión no está disponible por ahora",
  TOO_MANY_REQUESTS: "Demasiados intentos, probá de nuevo en un rato",
};

export function translateAuthError(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "Ocurrió un error inesperado";
  return (error.code && AUTH_ERROR_MESSAGES[error.code]) || error.message || "Ocurrió un error inesperado";
}
