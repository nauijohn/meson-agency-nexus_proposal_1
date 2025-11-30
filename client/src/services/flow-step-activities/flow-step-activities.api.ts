import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type IdParam,
  type PaginationArgs,
} from "../base.type";
import type {
  CreateFlowStepActivity,
  FlowStepActivity,
} from "./flow-step-activities.type";

const URL = ({ args, id }: { args?: PaginationArgs | void; id?: string }) => {
  let url = id ? `flow-step-activities/${id}` : `flow-step-activities`;
  if (args) {
    const params = new URLSearchParams();
    if (args.page) params.append("page", args.page.toString());
    if (args.limit) params.append("limit", args.limit.toString());
    url += `?${params.toString()}`;
  }
  return url;
};

const flowStepActivitiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFlowStepActivity: builder.mutation<
      FlowStepActivity,
      CreateFlowStepActivity
    >({
      invalidatesTags: [API_TAGS.CAMPAIGN_FLOW_STEPS, API_TAGS.FLOWS],
      query: (body) => {
        return {
          url: URL({}),
          method: HttpMethods.POST,
          body,
        };
      },
    }),
    deleteFlowStepActivity: builder.mutation<void, IdParam>({
      invalidatesTags: [API_TAGS.CAMPAIGN_FLOW_STEPS, API_TAGS.FLOWS],
      query: ({ id }) => {
        return {
          url: URL({ id }),
          method: HttpMethods.DELETE,
        };
      },
    }),
  }),
});

export const {
  useCreateFlowStepActivityMutation,
  useDeleteFlowStepActivityMutation,
} = flowStepActivitiesApi;

export default flowStepActivitiesApi;
