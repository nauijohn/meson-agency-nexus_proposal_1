import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type FlowActivity,
  flowActivitySchema,
} from "./flow-activities.type";

const URL = () => `flow-activities`;

export const { useAddFlowActivityMutation, useGetFlowActivitiesQuery } =
  api.injectEndpoints({
    endpoints: (builder) => ({
      addFlowActivity: builder.mutation<FlowActivity, Partial<FlowActivity>>({
        query: (body) => ({
          url: URL(),
          method: HttpMethods.POST,
          body,
        }),
      }),

      getFlowActivities: builder.query<FlowActivity[], void>({
        providesTags: [API_TAGS.FLOW_ACTIVITIES],
        query: () => URL(),
        responseSchema: flowActivitySchema.array(),
      }),
    }),
  });
