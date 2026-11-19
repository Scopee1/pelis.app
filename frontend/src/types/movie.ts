import type { MOVIE_GENRES } from "../constants/movie";

export type MovieGenre = (typeof MOVIE_GENRES)[number];

// Misma forma que IMovie en backend/src/models/Movie.ts, con las fechas como string (JSON).
export interface Movie {
  _id: string;
  title: string;
  director: string;
  genre: MovieGenre;
  releaseDate: string;
  durationMinutes: number;
  rating: number;
  isFeatured: boolean;
  synopsis?: string;
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface MovieListParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: MovieGenre;
  featured?: boolean;
  sortBy?: "createdAt" | "title" | "releaseDate" | "rating";
  sortOrder?: "asc" | "desc";
}
