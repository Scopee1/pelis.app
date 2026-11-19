import { NavLink } from "react-router";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-1 pb-2 text-sm font-medium transition ${
    isActive ? "border-amber-400 text-white" : "border-transparent text-zinc-400 hover:text-white"
  }`;

export const AdminTabs = () => (
  <nav className="flex gap-6 border-b border-zinc-800" aria-label="Secciones de administración">
    <NavLink to="/admin" end className={tabClass}>
      Películas
    </NavLink>
    <NavLink to="/admin/users" className={tabClass}>
      Usuarios y roles
    </NavLink>
  </nav>
);
