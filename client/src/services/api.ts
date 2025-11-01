import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_BASE_URL }),
  tagTypes: ["Users", "UserWithUnassignedClients", "UserClients"],
  endpoints: () => ({}),
});

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
  PUT: "PUT",
};

export default api;
