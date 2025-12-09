import type { RootState } from "@/store";
import { setCredentials } from "@/store/auth.slice";
import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import type { Tokens } from "./auth/authtype";

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
  CLIENTS: "Clients",
};

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
  PUT: "PUT",
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BACKEND_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If expired access token
  if (result.error && result.error.status === 401) {
    console.log("Token expired → refreshing...");

    // Call refresh token endpoint
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: HttpMethods.POST,
        credentials: "include", // required if refresh token is in cookies
      },
      api,
      extraOptions,
    );

    const tokens = refreshResult.data as Tokens;
    console.log("tokens: ", tokens);

    if (tokens) {
      const newAccessToken = tokens.accessToken;

      // Update token in Redux
      localStorage.setItem("accessToken", newAccessToken);
      api.dispatch(setCredentials({ accessToken: newAccessToken }));

      // Retry original API request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    }
    // else {
    //   console.log("Refresh failed → logging out");
    //   api.dispatch(authSlice.actions.logout());
    // }
  }

  return result;
};

const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});

export default api;
