import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => (
  <div className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link to="/" className="font-display text-center text-2xl font-bold">
        pelis<span className="text-amber-400">.app</span>
      </Link>
      <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>
        {children}
      </div>
      <p className="text-center text-sm text-zinc-400">{footer}</p>
    </div>
  </div>
);
