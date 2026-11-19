// Mismo listado que backend/src/constants/movie.constants.ts.
export const MOVIE_GENRES = [
  "Acción",
  "Animación",
  "Ciencia ficción",
  "Comedia",
  "Documental",
  "Drama",
  "Fantasía",
  "Romance",
  "Suspenso",
  "Terror",
] as const;

export const MOVIE_LIMITS = {
  titleMaxLength: 120,
  directorMaxLength: 80,
  synopsisMaxLength: 1000,
  minDurationMinutes: 1,
  maxDurationMinutes: 600,
  minRating: 0,
  maxRating: 10,
} as const;

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Agregadas recientemente" },
  { value: "rating:desc", label: "Mejor puntuadas" },
  { value: "releaseDate:desc", label: "Estrenos más nuevos" },
  { value: "releaseDate:asc", label: "Estrenos más viejos" },
  { value: "title:asc", label: "Título (A-Z)" },
] as const;

export const DEFAULT_SORT = SORT_OPTIONS[0].value;

export const CATALOG_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 300;

export const GENRE_GRADIENTS: Record<(typeof MOVIE_GENRES)[number], string> = {
  Acción: "from-orange-600 to-red-900",
  Animación: "from-sky-500 to-indigo-800",
  "Ciencia ficción": "from-cyan-600 to-slate-900",
  Comedia: "from-yellow-500 to-orange-700",
  Documental: "from-stone-500 to-stone-800",
  Drama: "from-rose-700 to-zinc-900",
  Fantasía: "from-fuchsia-600 to-violet-900",
  Romance: "from-pink-500 to-rose-900",
  Suspenso: "from-slate-600 to-zinc-950",
  Terror: "from-red-800 to-black",
};
