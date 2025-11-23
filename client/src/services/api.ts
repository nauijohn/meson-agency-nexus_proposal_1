import type { RootState } from "@/store";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_TAGS = {
  USERS: "Users",
  USER: "User",
  USER_WITH_UNASSIGNED_CLIENTS: "UserWithUnassignedClients",
  USER_CLIENTS: "UserClients",
  FLOW_ACTIVITIES: "FlowActivities",
  FLOWS: "Flows",
  CAMPAIGNS: "Campaigns",
  CAMPAIGN_FLOW_STEPS: "CampaignFlowSteps",
  AUTH: "Auth",
};

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
  PUT: "PUT",
};

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;

      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});

export default api;
