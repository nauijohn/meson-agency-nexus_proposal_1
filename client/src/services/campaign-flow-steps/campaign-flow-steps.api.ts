import api, { API_TAGS } from "../api";
import {
  type CampaignFlowStep,
  campaignFlowStepSchema,
} from "./campaign-flow-steps.type";

const URL = (id?: string) =>
  id ? `campaign-flow-steps/${id}` : `campaign-flow-steps`;

export const { useGetCampaignFlowStepsQuery } = api.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignFlowSteps: builder.query<CampaignFlowStep[], void>({
      providesTags: [API_TAGS.CAMPAIGN_FLOW_STEPS],
      query: () => URL(),
      responseSchema: campaignFlowStepSchema.array(),
    }),
  }),
});
