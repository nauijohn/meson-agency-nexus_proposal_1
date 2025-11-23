import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { JSX } from "react/jsx-runtime";

import type { RootState } from "@/store";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
