import { useSearchParams } from "react-router";
import { DEFAULT_SORT, MOVIE_GENRES, SORT_OPTIONS } from "../constants/movie";
import type { MovieGenre, MovieListParams } from "../types/movie";

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogFilters {
  page: number;
  search: string;
  genre: MovieGenre | "";
  sort: SortValue;
  featuredOnly: boolean;
}

function isGenre(value: string | null): value is MovieGenre {
  return MOVIE_GENRES.includes(value as MovieGenre);
}

function isSort(value: string | null): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

// Los filtros viven en la URL: F5 o compartir el link mantiene la busqueda.
export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const genreParam = searchParams.get("genre");
  const sortParam = searchParams.get("sort");
  const filters: CatalogFilters = {
    page: Math.max(1, Number(searchParams.get("page")) || 1),
    search: searchParams.get("q") ?? "",
    genre: isGenre(genreParam) ? genreParam : "",
    sort: isSort(sortParam) ? sortParam : DEFAULT_SORT,
    featuredOnly: searchParams.get("featured") === "true",
  };

  const setFilter = (key: "page" | "q" | "genre" | "sort" | "featured", value: string) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      },
      { replace: key === "q" },
    );
  };

  return { filters, setFilter };
}

export function toListParams(filters: CatalogFilters, limit: number): MovieListParams {
  const [sortBy, sortOrder] = filters.sort.split(":") as [MovieListParams["sortBy"], MovieListParams["sortOrder"]];
  return {
    page: filters.page,
    limit,
    search: filters.search || undefined,
    genre: filters.genre || undefined,
    featured: filters.featuredOnly || undefined,
    sortBy,
    sortOrder,
  };
}
