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

export type MovieGenre = (typeof MOVIE_GENRES)[number];

export const MOVIE_LIMITS = {
  titleMaxLength: 120,
  directorMaxLength: 80,
  synopsisMaxLength: 1000,
  minDurationMinutes: 1,
  maxDurationMinutes: 600,
  minRating: 0,
  maxRating: 10,
  earliestReleaseDate: "1888-01-01",
} as const;

export const MOVIE_SORT_FIELDS = ["createdAt", "title", "releaseDate", "rating"] as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 50,
} as const;
