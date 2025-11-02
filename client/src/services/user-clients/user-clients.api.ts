import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type TransformedUserClient,
  transformedUserClientSchema,
  transformSchema,
  type UserClient,
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

    getUserClients: query<UserClient[], void>({
      providesTags: [API_TAGS.USER_CLIENTS],
      query: () => URL(),
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
