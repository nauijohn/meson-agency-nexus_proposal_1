import api, { API_TAGS, HttpMethods } from "../api";
import { type IdParam, type PaginationArgs } from "../base.type";
import type {
  CreateFlowStep,
  FlowStep,
  UpdateFlowStep,
} from "./flow-steps.type";

const URL = ({ args, id }: { args?: PaginationArgs | void; id?: string }) => {
  let url = id ? `flow-steps/${id}` : `flow-steps`;
  if (args) {
    const params = new URLSearchParams();
    if (args.page) params.append("page", args.page.toString());
    if (args.limit) params.append("limit", args.limit.toString());
    url += `?${params.toString()}`;
  }
  return url;
};

const flowStepsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFlowStep: builder.mutation<FlowStep, CreateFlowStep>({
      invalidatesTags: [API_TAGS.CAMPAIGN_FLOW_STEPS, API_TAGS.FLOWS],
      query: (body) => {
        return {
          url: URL({}),
          method: HttpMethods.POST,
          body,
        };
      },
    }),
    updateFlowStep: builder.mutation<FlowStep, UpdateFlowStep>({
      invalidatesTags: [API_TAGS.CAMPAIGN_FLOW_STEPS, API_TAGS.FLOWS],
      query: ({ id, ...body }) => {
        return {
          url: URL({ id }),
          method: HttpMethods.PATCH,
          body,
        };
      },
    }),
    deleteFlowStep: builder.mutation<void, IdParam>({
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
  useCreateFlowStepMutation,
  useUpdateFlowStepMutation,
  useDeleteFlowStepMutation,
} = flowStepsApi;

export default flowStepsApi;
