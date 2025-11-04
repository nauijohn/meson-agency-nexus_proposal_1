import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type Campaign,
  campaignSchema,
  type CreateCampaign,
  createCampaignSchema,
  type UpdateCampaign,
  updateCampaignSchema,
} from "./campaigns.type";

const URL = (id?: string) => (id ? `campaigns/${id}` : `campaigns`);

export const {
  useAddCampaignMutation,
  useGetCampaignsQuery,
  useUpdateCampaignMutation,
  useGetCampaignsWithUnassignedFlowQuery,
} = api.injectEndpoints({
  endpoints: (builder) => ({
    addCampaign: builder.mutation<Campaign, Partial<CreateCampaign>>({
      invalidatesTags: [API_TAGS.CAMPAIGNS],
      argSchema: createCampaignSchema,
      query: (body) => {
        console.log("body campaign: ", body);
        return {
          url: URL(),
          method: HttpMethods.POST,
          body,
        };
      },
    }),

    updateCampaign: builder.mutation<Campaign, Partial<UpdateCampaign>>({
      invalidatesTags: [API_TAGS.CAMPAIGNS],
      argSchema: updateCampaignSchema,
      query: ({ id, ...body }) => {
        console.log("body campaign: ", body);
        return {
          url: URL(id),
          method: HttpMethods.PATCH,
          body,
        };
      },
    }),

    getCampaigns: builder.query<Campaign[], void>({
      providesTags: [API_TAGS.CAMPAIGNS],
      query: () => URL(),
      responseSchema: campaignSchema.array(),
    }),

    getCampaignsWithUnassignedFlow: builder.query<Campaign[], void>({
      providesTags: [API_TAGS.CAMPAIGNS],
      query: () => `${URL()}?unassignedFlow=true`,
      responseSchema: campaignSchema.array(),
    }),
  }),
});
