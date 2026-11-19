// Evita que un texto de busqueda inyecte su propia regex (ReDoS) en un filtro $regex.
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
