import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type PaginatedResponse,
  paginatedResponseSchema,
  type PaginationArgs,
} from "../base.type";
import { paginate } from "../utils/paginate";
import {
  type CreateFlow,
  type Flow,
  flowSchema,
  type UpdateFlow,
} from "./flows.type";

const URL = (args?: PaginationArgs | void) => {
  let url = `flows`;
  if (args) {
    const params = new URLSearchParams();
    if (args.page) params.append("page", args.page.toString());
    if (args.limit) params.append("limit", args.limit.toString());
    url += `?${params.toString()}`;
  }
  return url;
};

const flowsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFlow: builder.mutation<Flow, Partial<CreateFlow>>({
      invalidatesTags: [API_TAGS.FLOWS],
      query: (body) => {
        return {
          url: URL(),
          method: HttpMethods.POST,
          body,
        };
      },
    }),

    updateFlow: builder.mutation<Flow, UpdateFlow>({
      invalidatesTags: [API_TAGS.FLOWS],
      query: ({ id, ...data }) => {
        console.log("Updating flow id:", id, "with data:", data);
        return {
          url: `flows/${id}`,
          method: HttpMethods.PATCH,
          body: data,
        };
      },
    }),

    getFlows: builder.query<PaginatedResponse<Flow>, PaginationArgs | void>({
      providesTags: [API_TAGS.FLOWS],
      query: (args) => {
        return URL(args);
      },
      rawResponseSchema: flowSchema.array(),
      responseSchema: paginatedResponseSchema(flowSchema),
      transformResponse: (response: Flow[], meta: FetchBaseQueryMeta) => {
        return paginate(response, meta);
      },
    }),
  }),
});

export const {
  useCreateFlowMutation,
  useGetFlowsQuery,
  useLazyGetFlowsQuery,
  useUpdateFlowMutation,
} = flowsApi;

export default flowsApi;
