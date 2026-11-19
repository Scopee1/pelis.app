import { useCallback } from "react";
import { MovieCard } from "../components/MovieCard";
import { SearchInput } from "../components/SearchInput";
import { Alert } from "../components/ui/Alert";
import { Pagination } from "../components/ui/Pagination";
import { CATALOG_PAGE_SIZE, MOVIE_GENRES, SORT_OPTIONS } from "../constants/movie";
import { toListParams, useCatalogFilters } from "../hooks/useCatalogFilters";
import { useGetMoviesQuery } from "../store/moviesApi";

const CatalogSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900" />
    ))}
  </div>
);

export const Home = () => {
  const { filters, setFilter } = useCatalogFilters();
  const { data, isLoading, isFetching, error } = useGetMoviesQuery(toListParams(filters, CATALOG_PAGE_SIZE));
  const handleSearch = useCallback((value: string) => setFilter("q", value), [setFilter]);

  const movies = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Catálogo de películas</h1>
        <p className="text-zinc-400">Buscá por título o director, filtrá por género y ordená como quieras.</p>
      </section>

      <section className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
        <SearchInput value={filters.search} onSearch={handleSearch} placeholder="Buscar título o director" />
        <select
          aria-label="Filtrar por género"
          className="input"
          value={filters.genre}
          onChange={(event) => setFilter("genre", event.target.value)}
        >
          <option value="">Todos los géneros</option>
          {MOVIE_GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          aria-label="Ordenar"
          className="input"
          value={filters.sort}
          onChange={(event) => setFilter("sort", event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap text-zinc-300">
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            checked={filters.featuredOnly}
            onChange={(event) => setFilter("featured", event.target.checked ? "true" : "")}
          />
          Solo destacadas
        </label>
      </section>

      {error && <Alert>{error.message}</Alert>}

      {isLoading ? (
        <CatalogSkeleton />
      ) : movies.length === 0 ? (
        <Alert tone="info">No hay películas que coincidan con la búsqueda.</Alert>
      ) : (
        <>
          <p className="text-sm text-zinc-500" aria-live="polite">
            {total} {total === 1 ? "película" : "películas"}
            {isFetching && " · actualizando…"}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={filters.page}
        totalPages={data?.meta.totalPages ?? 0}
        onPageChange={(page) => setFilter("page", String(page))}
      />
    </div>
  );
};
