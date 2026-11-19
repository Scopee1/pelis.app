import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import * as moviesService from "../services/movies.service.js";
import { sendError } from "../lib/http-error.js";
import { CreateMovieInput, ListMoviesInput, UpdateMovieInput } from "../schemas/movie.schema.js";

const MOVIE_NOT_FOUND = "Película no encontrada";
const INVALID_ID = "El id enviado no es válido";

type MovieParams = { id: string };

function isMongooseValidationError(error: unknown): error is Error {
  return error instanceof Error && error.name === "ValidationError";
}

export async function listMovies(_req: Request, res: Response): Promise<void> {
  try {
    const input = res.locals.query as ListMoviesInput;
    res.status(200).json(await moviesService.listMovies(input));
  } catch (error) {
    console.error("[movies] error listing:", error);
    sendError(res, 500, "No se pudieron obtener las películas");
  }
}

export async function getMovieById(req: Request<MovieParams>, res: Response): Promise<void> {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    sendError(res, 400, INVALID_ID);
    return;
  }

  try {
    const movie = await moviesService.findMovieById(id);
    if (!movie) {
      sendError(res, 404, MOVIE_NOT_FOUND);
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("[movies] error fetching by id:", error);
    sendError(res, 500, "No se pudo obtener la película");
  }
}

export async function createMovie(req: Request<{}, {}, CreateMovieInput>, res: Response): Promise<void> {
  try {
    res.status(201).json(await moviesService.createMovie(req.body));
  } catch (error) {
    if (isMongooseValidationError(error)) {
      sendError(res, 400, error.message);
      return;
    }
    console.error("[movies] error creating:", error);
    sendError(res, 500, "No se pudo crear la película");
  }
}

export async function updateMovie(req: Request<MovieParams, {}, UpdateMovieInput>, res: Response): Promise<void> {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    sendError(res, 400, INVALID_ID);
    return;
  }

  try {
    const movie = await moviesService.updateMovie(id, req.body);
    if (!movie) {
      sendError(res, 404, MOVIE_NOT_FOUND);
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    if (isMongooseValidationError(error)) {
      sendError(res, 400, error.message);
      return;
    }
    console.error("[movies] error updating:", error);
    sendError(res, 500, "No se pudo editar la película");
  }
}

export async function deleteMovie(req: Request<MovieParams>, res: Response): Promise<void> {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    sendError(res, 400, INVALID_ID);
    return;
  }

  try {
    const movie = await moviesService.deleteMovie(id);
    if (!movie) {
      sendError(res, 404, MOVIE_NOT_FOUND);
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("[movies] error deleting:", error);
    sendError(res, 500, "No se pudo eliminar la película");
  }
}
