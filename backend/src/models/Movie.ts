import { Schema, model, Document, Model, Types } from "mongoose";
import { MOVIE_GENRES, MOVIE_LIMITS, MovieGenre } from "../constants/movie.constants.js";

export interface IMovie {
  title: string;
  director: string;
  genre: MovieGenre;
  releaseDate: Date;
  durationMinutes: number;
  rating: number;
  isFeatured: boolean;
  synopsis?: string;
  posterUrl?: string;
}

export interface IMovieDocument extends IMovie, Document {
  _id: Types.ObjectId;
}

const movieSchema = new Schema<IMovieDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: MOVIE_LIMITS.titleMaxLength },
    director: { type: String, required: true, trim: true, maxlength: MOVIE_LIMITS.directorMaxLength },
    genre: { type: String, required: true, enum: MOVIE_GENRES },
    releaseDate: { type: Date, required: true },
    durationMinutes: {
      type: Number,
      required: true,
      min: MOVIE_LIMITS.minDurationMinutes,
      max: MOVIE_LIMITS.maxDurationMinutes,
    },
    rating: { type: Number, required: true, min: MOVIE_LIMITS.minRating, max: MOVIE_LIMITS.maxRating },
    isFeatured: { type: Boolean, default: false },
    synopsis: { type: String, trim: true, maxlength: MOVIE_LIMITS.synopsisMaxLength },
    posterUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

movieSchema.index({ title: 1 });

const Movie: Model<IMovieDocument> = model<IMovieDocument>("Movie", movieSchema);

export default Movie;
