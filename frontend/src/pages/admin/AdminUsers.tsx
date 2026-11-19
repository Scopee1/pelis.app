import { useCallback, useEffect, useState } from "react";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { Alert } from "../../components/ui/Alert";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { authClient } from "../../lib/auth-client";
import { translateAuthError } from "../../lib/auth-errors";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "../../types/auth";

const USERS_PAGE_LIMIT = 100;

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  createdAt: Date | string;
}

type Notice = { tone: "success" | "error"; text: string };

export const AdminUsers = () => {
  const { user: currentUser } = useCurrentUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadUsers = useCallback(async () => {
    const { data, error } = await authClient.admin.listUsers({
      query: { limit: USERS_PAGE_LIMIT, sortBy: "createdAt", sortDirection: "desc" },
    });
    if (error) setNotice({ tone: "error", text: translateAuthError(error) });
    else setUsers(data.users);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const changeRole = async (target: ManagedUser, role: UserRole) => {
    setSavingId(target.id);
    setNotice(null);
    const { error } = await authClient.admin.setRole({ userId: target.id, role });
    setSavingId(null);

    if (error) {
      setNotice({ tone: "error", text: translateAuthError(error) });
      return;
    }
    setUsers((previous) => previous.map((user) => (user.id === target.id ? { ...user, role } : user)));
    setNotice({ tone: "success", text: `${target.name} ahora es ${ROLE_LABELS[role]}.` });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Panel de administración</h1>
        <p className="text-zinc-400">Cambiá el rol de los usuarios registrados.</p>
      </header>

      <AdminTabs />

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-zinc-900 text-xs tracking-wide text-zinc-400 uppercase">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Registrado</th>
              <th className="px-4 py-3">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-500">
                  Cargando usuarios…
                </td>
              </tr>
            )}
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id;
              const role = (user.role ?? "user") as UserRole;
              return (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {user.name} {isSelf && <span className="text-xs text-zinc-500">(vos)</span>}
                    </p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{new Date(user.createdAt).toLocaleDateString("es-AR")}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Rol de ${user.name}`}
                      className="input w-36"
                      value={role}
                      disabled={isSelf || savingId === user.id}
                      title={isSelf ? "No podés cambiar tu propio rol" : undefined}
                      onChange={(event) => changeRole(user, event.target.value as UserRole)}
                    >
                      {USER_ROLES.map((option) => (
                        <option key={option} value={option}>
                          {ROLE_LABELS[option]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
