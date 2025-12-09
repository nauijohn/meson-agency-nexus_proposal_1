import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

import api, { API_TAGS } from "../api";
import {
  type PaginatedResponse,
  paginatedResponseSchema,
  type PaginationArgs,
} from "../base.type";
import { paginate } from "../utils/paginate";
import {
  type Client,
  clientSchema,
} from "./clients.type";

const URL = (id?: string) => (id ? `clients/${id}` : `clients`);

const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<Client>, PaginationArgs | void>(
      {
        providesTags: [API_TAGS.CLIENTS],
        query: () => URL(),
        // responseSchema: clientSchema.array(),
        rawResponseSchema: clientSchema.array(),
        responseSchema: paginatedResponseSchema(clientSchema),
        transformResponse: (response: Client[], meta: FetchBaseQueryMeta) => {
          return paginate(response, meta);
        },
      },
    ),
  }),
});

export const { useGetClientsQuery } = clientsApi;

export default clientsApi;
