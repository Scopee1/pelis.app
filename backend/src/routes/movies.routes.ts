import { Router } from "express";
import { listMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movies.controller.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { createMovieSchema, listMoviesSchema, updateMovieSchema } from "../schemas/movie.schema.js";

const router = Router();
const onlyAdmin = [authMiddleware, requireRole("admin")];

router.get("/", validateQuery(listMoviesSchema), listMovies);
router.get("/:id", getMovieById);
router.post("/", onlyAdmin, validateBody(createMovieSchema), createMovie);
router.put("/:id", onlyAdmin, validateBody(createMovieSchema), updateMovie);
router.patch("/:id", onlyAdmin, validateBody(updateMovieSchema), updateMovie);
router.delete("/:id", onlyAdmin, deleteMovie);

export default router;
