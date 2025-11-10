import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type Campaign,
  campaignSchema,
  type CreateCampaign,
  createCampaignSchema,
  type QueryCampaign,
  queryCampaignSchema,
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

    getCampaigns: builder.query<Campaign[], QueryCampaign>({
      providesTags: [API_TAGS.CAMPAIGNS],
      query: (args) => {
        const queryParams = new URLSearchParams();
        if (args.clientId) {
          queryParams.append("clientId", args.clientId);
        }
        console.log("Query Params:", queryParams.toString());

        const URL_WITH_QUERY = queryParams.toString()
          ? `${URL()}?${queryParams.toString()}`
          : URL();
        return {
          url: URL_WITH_QUERY,
          method: HttpMethods.GET,
        };
      },
      argSchema: queryCampaignSchema,
      responseSchema: campaignSchema.array(),
    }),

    getCampaignsWithUnassignedFlow: builder.query<Campaign[], void>({
      providesTags: [API_TAGS.CAMPAIGNS],
      query: () => `${URL()}?unassignedFlow=true`,
      responseSchema: campaignSchema.array(),
    }),
  }),
});
