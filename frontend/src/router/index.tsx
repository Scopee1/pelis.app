import { createBrowserRouter } from "react-router";
import { Layout } from "../layouts/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home";
import { MovieDetail } from "../pages/MovieDetail";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { NotFound } from "../pages/NotFound";
import { AdminMovies } from "../pages/admin/AdminMovies";
import { AdminUsers } from "../pages/admin/AdminUsers";
import { EditMovie, NewMovie } from "../pages/admin/MovieEditor";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "movies/:id", element: <MovieDetail /> },
      {
        // Sin sesion -> /login. Con sesion pero sin rol admin -> pantalla "Sin permisos".
        element: <ProtectedRoute roles={["admin"]} />,
        children: [
          {
            path: "admin",
            children: [
              { index: true, element: <AdminMovies /> },
              { path: "movies/new", element: <NewMovie /> },
              { path: "movies/:id/edit", element: <EditMovie /> },
              { path: "users", element: <AdminUsers /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
