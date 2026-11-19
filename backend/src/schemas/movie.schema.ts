import { z } from "zod";
import { MOVIE_GENRES, MOVIE_LIMITS, MOVIE_SORT_FIELDS, PAGINATION } from "../constants/movie.constants.js";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const genreSchema = z.enum(MOVIE_GENRES, { error: `El género debe ser uno de: ${MOVIE_GENRES.join(", ")}` });

export const createMovieSchema = z.object({
  title: z
    .string({ error: "El título es obligatorio" })
    .trim()
    .min(1, "El título es obligatorio")
    .max(MOVIE_LIMITS.titleMaxLength, `El título no puede superar ${MOVIE_LIMITS.titleMaxLength} caracteres`),
  director: z
    .string({ error: "El director es obligatorio" })
    .trim()
    .min(1, "El director es obligatorio")
    .max(MOVIE_LIMITS.directorMaxLength, `El director no puede superar ${MOVIE_LIMITS.directorMaxLength} caracteres`),
  genre: genreSchema,
  // Solo strings ISO: z.coerce.date() aceptaba null o true y los convertia en 1970.
  releaseDate: z
    .union([z.iso.date(), z.iso.datetime()], { error: "La fecha de estreno no es válida (formato AAAA-MM-DD)" })
    .transform((value) => new Date(value))
    .refine((date) => date >= new Date(MOVIE_LIMITS.earliestReleaseDate), "La fecha de estreno es demasiado antigua"),
  durationMinutes: z
    .number({ error: "La duración debe ser un número" })
    .int("La duración debe ser un número entero de minutos")
    .min(MOVIE_LIMITS.minDurationMinutes, "La duración debe ser de al menos 1 minuto")
    .max(MOVIE_LIMITS.maxDurationMinutes, `La duración no puede superar ${MOVIE_LIMITS.maxDurationMinutes} minutos`),
  rating: z
    .number({ error: "La puntuación debe ser un número" })
    .min(MOVIE_LIMITS.minRating, `La puntuación mínima es ${MOVIE_LIMITS.minRating}`)
    .max(MOVIE_LIMITS.maxRating, `La puntuación máxima es ${MOVIE_LIMITS.maxRating}`),
  isFeatured: z.boolean({ error: "Destacada debe ser true o false" }).optional(),
  synopsis: z
    .string()
    .trim()
    .max(MOVIE_LIMITS.synopsisMaxLength, `La sinopsis no puede superar ${MOVIE_LIMITS.synopsisMaxLength} caracteres`)
    .optional(),
  posterUrl: z.union([z.url("La URL del poster no es válida"), z.literal("")]).optional(),
});

export const updateMovieSchema = createMovieSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, "Hay que enviar al menos un campo para editar");

export const listMoviesSchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.defaultPage),
  limit: z.coerce.number().int().min(1).max(PAGINATION.maxLimit).default(PAGINATION.defaultLimit),
  search: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  genre: z.preprocess(emptyToUndefined, genreSchema.optional()),
  featured: z.preprocess(emptyToUndefined, z.enum(["true", "false"]).transform((value) => value === "true").optional()),
  sortBy: z.preprocess(emptyToUndefined, z.enum(MOVIE_SORT_FIELDS).default("createdAt")),
  sortOrder: z.preprocess(emptyToUndefined, z.enum(["asc", "desc"]).default("desc")),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type ListMoviesInput = z.infer<typeof listMoviesSchema>;
