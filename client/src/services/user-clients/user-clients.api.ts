import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type TransformedUserClient,
  transformedUserClientSchema,
  transformSchema,
  type UserClient,
  type UserClientQuery,
  userClientQuerySchema,
  userClientSchema,
} from "./user-clients.type";

const URL = () => `user-clients`;

const userClientsApi = api.injectEndpoints({
  endpoints: ({ mutation, query }) => ({
    addUserClient: mutation<void, { userId: string; clientId: string }>({
      invalidatesTags: [API_TAGS.USER_CLIENTS],
      query: (body) => ({
        url: URL(),
        method: HttpMethods.POST,
        body,
      }),
    }),

    getUserClients: query<UserClient[], UserClientQuery>({
      providesTags: [API_TAGS.USER_CLIENTS],
      argSchema: userClientQuerySchema,
      query: (args) => {
        const queryParams = new URLSearchParams();
        if (args.userId) {
          queryParams.append("userId", args.userId);
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
      responseSchema: userClientSchema.array(),
    }),

    getTransformedUserClients: query<TransformedUserClient[], void>({
      providesTags: [API_TAGS.USER_CLIENTS],
      query: () => URL(),
      rawResponseSchema: userClientSchema.array(),
      responseSchema: transformedUserClientSchema.array(),
      transformResponse: (response) => transformSchema.array().parse(response),
    }),
  }),
});

export const {
  useAddUserClientMutation,
  useGetUserClientsQuery,
  useGetTransformedUserClientsQuery,
} = userClientsApi;
