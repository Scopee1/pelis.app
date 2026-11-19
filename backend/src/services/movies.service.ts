import { QueryFilter } from "mongoose";
import Movie, { IMovieDocument } from "../models/Movie.js";
import { escapeRegex } from "../lib/escape-regex.js";
import { CreateMovieInput, ListMoviesInput, UpdateMovieInput } from "../schemas/movie.schema.js";
import { Paginated } from "../types/pagination.types.js";

// Filtro armado campo por campo desde input validado: nunca se pasa el query crudo a Mongo.
function buildFilter({ search, genre, featured }: ListMoviesInput): QueryFilter<IMovieDocument> {
  const filter: QueryFilter<IMovieDocument> = {};
  if (genre) filter.genre = genre;
  if (featured !== undefined) filter.isFeatured = featured;
  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [{ title: pattern }, { director: pattern }];
  }
  return filter;
}

export async function listMovies(input: ListMoviesInput): Promise<Paginated<IMovieDocument>> {
  const { page, limit, sortBy, sortOrder } = input;
  const filter = buildFilter(input);

  const [data, total] = await Promise.all([
    Movie.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Movie.countDocuments(filter),
  ]);

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export function findMovieById(id: string): Promise<IMovieDocument | null> {
  return Movie.findById(id);
}

export function createMovie(input: CreateMovieInput): Promise<IMovieDocument> {
  return Movie.create(input);
}

export function updateMovie(id: string, input: UpdateMovieInput): Promise<IMovieDocument | null> {
  return Movie.findByIdAndUpdate(id, input, { returnDocument: "after", runValidators: true });
}

export function deleteMovie(id: string): Promise<IMovieDocument | null> {
  return Movie.findByIdAndDelete(id);
}
