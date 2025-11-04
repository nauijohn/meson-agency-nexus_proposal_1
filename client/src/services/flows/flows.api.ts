import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type CreateFlow,
  type Flow,
  flowSchema,
} from "./flows.type";

const URL = () => `flows`;

export const { useAddFlowMutation, useGetFlowsQuery } = api.injectEndpoints({
  endpoints: (builder) => ({
    addFlow: builder.mutation<Flow, Partial<CreateFlow>>({
      invalidatesTags: [API_TAGS.FLOWS],
      query: (body) => ({
        url: URL(),
        method: HttpMethods.POST,
        body,
      }),
    }),

    getFlows: builder.query<Flow[], void>({
      providesTags: [API_TAGS.FLOWS],
      query: () => URL(),
      responseSchema: flowSchema.array(),
    }),
  }),
});
