import { useSession } from "../lib/auth-client";
import type { UserRole } from "../types/auth";

export function useCurrentUser() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const role = (user?.role ?? "user") as UserRole;

  return { user, role, isAdmin: user !== null && role === "admin", isPending };
}
