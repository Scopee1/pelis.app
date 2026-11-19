import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const FormField = ({ label, htmlFor, error, hint, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-300">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} role="alert" className="text-xs text-red-400">
        {error}
      </p>
    ) : (
      hint && <p className="text-xs text-zinc-500">{hint}</p>
    )}
  </div>
);
