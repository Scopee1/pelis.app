import { useState } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { MOVIE_GENRES, MOVIE_LIMITS } from "../../constants/movie";
import type { ApiError } from "../../lib/api";
import { movieSchema, type MovieFormValues } from "../../schemas/movie.schema";
import { Alert } from "../ui/Alert";
import { FormField } from "../ui/FormField";

interface MovieFormProps {
  defaultValues: DefaultValues<MovieFormValues>;
  submitLabel: string;
  onSubmit: (values: MovieFormValues) => Promise<ApiError | null>;
}

const FORM_FIELDS = Object.keys(movieSchema.shape) as Path<MovieFormValues>[];

export const MovieForm = ({ defaultValues, submitLabel, onSubmit }: MovieFormProps) => {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({ resolver: zodResolver(movieSchema), defaultValues });

  // Si el back rechaza algun campo (validacion de Zod del servidor), el error se muestra en ese input.
  const showServerErrors = (apiError: ApiError) => {
    setServerError(apiError.message);
    for (const field of FORM_FIELDS) {
      const message = apiError.details?.[field]?.[0];
      if (message) setError(field, { type: "server", message });
    }
  };

  const submit = async (values: MovieFormValues) => {
    setServerError("");
    const apiError = await onSubmit(values);
    if (apiError) showServerErrors(apiError);
  };

  const invalid = (field: keyof MovieFormValues) => Boolean(errors[field]);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      {serverError && <Alert>{serverError}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Título" htmlFor="title" error={errors.title?.message}>
          <input id="title" className="input" aria-invalid={invalid("title")} {...register("title")} />
        </FormField>
        <FormField label="Director" htmlFor="director" error={errors.director?.message}>
          <input id="director" className="input" aria-invalid={invalid("director")} {...register("director")} />
        </FormField>
        <FormField label="Género" htmlFor="genre" error={errors.genre?.message}>
          <select id="genre" className="input" aria-invalid={invalid("genre")} {...register("genre")}>
            <option value="">Elegí un género</option>
            {MOVIE_GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Fecha de estreno" htmlFor="releaseDate" error={errors.releaseDate?.message}>
          <input
            id="releaseDate"
            type="date"
            className="input"
            aria-invalid={invalid("releaseDate")}
            {...register("releaseDate")}
          />
        </FormField>
        <FormField label="Duración (minutos)" htmlFor="durationMinutes" error={errors.durationMinutes?.message}>
          <input
            id="durationMinutes"
            type="number"
            inputMode="numeric"
            min={MOVIE_LIMITS.minDurationMinutes}
            max={MOVIE_LIMITS.maxDurationMinutes}
            className="input"
            aria-invalid={invalid("durationMinutes")}
            {...register("durationMinutes", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Puntuación (0 a 10)" htmlFor="rating" error={errors.rating?.message}>
          <input
            id="rating"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={MOVIE_LIMITS.minRating}
            max={MOVIE_LIMITS.maxRating}
            className="input"
            aria-invalid={invalid("rating")}
            {...register("rating", { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <FormField
        label="URL del poster"
        htmlFor="posterUrl"
        error={errors.posterUrl?.message}
        hint="Opcional. Si no hay, se muestra una portada con el título."
      >
        <input
          id="posterUrl"
          type="url"
          placeholder="https://…"
          className="input"
          aria-invalid={invalid("posterUrl")}
          {...register("posterUrl")}
        />
      </FormField>

      <FormField label="Sinopsis" htmlFor="synopsis" error={errors.synopsis?.message} hint="Opcional">
        <textarea id="synopsis" rows={4} className="input" aria-invalid={invalid("synopsis")} {...register("synopsis")} />
      </FormField>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" className="size-4 accent-amber-400" {...register("isFeatured")} />
        Marcar como destacada
      </label>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : submitLabel}
        </button>
        <Link to="/admin" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  );
};
