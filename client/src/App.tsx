import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import ProtectedRoute from "./components/app/ProtectedRoute";
import Layout from "./Layout";
import { flowsLoader } from "./loaders/flows.loader";
import { layoutLoader } from "./loaders/layout.loader";
import Admin from "./pages/Admin";
import Admin2 from "./pages/Admin2";
import AdminHome from "./pages/AdminHome";
import Flows from "./pages/Flows";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: layoutLoader,
    hydrateFallbackElement: <div>Loading...</div>,
    errorElement: <div>Something went wrong.</div>,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin2",
        element: (
          <ProtectedRoute>
            <Admin2 />
          </ProtectedRoute>
        ),
      },
      {
        path: "/flows",
        loader: flowsLoader,
        hydrateFallbackElement: <div>Loading Flows...</div>,
        errorElement: <div>Something went wrong in Flows.</div>,
        element: (
          <ProtectedRoute>
            <Flows />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
