import { Link, useNavigate, useParams } from "react-router";
import { MovieForm } from "../../components/admin/MovieForm";
import { Alert } from "../../components/ui/Alert";
import type { ApiError } from "../../lib/api";
import { emptyMovieForm, toMovieFormValues, type MovieFormValues } from "../../schemas/movie.schema";
import { useCreateMovieMutation, useGetMovieByIdQuery, useUpdateMovieMutation } from "../../store/moviesApi";

const EditorShell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mx-auto flex max-w-3xl flex-col gap-6">
    <Link to="/admin" className="text-sm text-zinc-400 hover:text-white">
      ← Volver al panel
    </Link>
    <h1 className="font-display text-3xl font-bold">{title}</h1>
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">{children}</div>
  </div>
);

export const NewMovie = () => {
  const navigate = useNavigate();
  const [createMovie] = useCreateMovieMutation();

  const handleSubmit = async (values: MovieFormValues): Promise<ApiError | null> => {
    const result = await createMovie(values);
    if ("error" in result) return result.error as ApiError;
    navigate(`/movies/${result.data._id}`);
    return null;
  };

  return (
    <EditorShell title="Nueva película">
      <MovieForm defaultValues={emptyMovieForm} submitLabel="Crear película" onSubmit={handleSubmit} />
    </EditorShell>
  );
};

export const EditMovie = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, error } = useGetMovieByIdQuery(id);
  const [updateMovie] = useUpdateMovieMutation();

  const handleSubmit = async (values: MovieFormValues): Promise<ApiError | null> => {
    const result = await updateMovie({ id, values });
    if ("error" in result) return result.error as ApiError;
    navigate(`/movies/${id}`);
    return null;
  };

  if (isLoading) return <p className="py-20 text-center text-zinc-500">Cargando película…</p>;

  return (
    <EditorShell title={movie ? `Editar "${movie.title}"` : "Editar película"}>
      {movie ? (
        <MovieForm defaultValues={toMovieFormValues(movie)} submitLabel="Guardar cambios" onSubmit={handleSubmit} />
      ) : (
        <Alert>{error?.message ?? "No se encontró la película"}</Alert>
      )}
    </EditorShell>
  );
};
