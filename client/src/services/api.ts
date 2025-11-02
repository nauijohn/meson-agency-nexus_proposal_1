import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_TAGS = {
  USERS: "Users",
  USER_WITH_UNASSIGNED_CLIENTS: "UserWithUnassignedClients",
  USER_CLIENTS: "UserClients",
  FLOW_ACTIVITIES: "FlowActivities",
};

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_BASE_URL }),
  tagTypes: Object.values(API_TAGS),
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
