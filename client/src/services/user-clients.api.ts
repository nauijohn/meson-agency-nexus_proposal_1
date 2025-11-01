import api, { HttpMethods } from "./api";

const USER_CLIENTS_URL = () => `user-clients`;

const userClientsApi = api.injectEndpoints({
  endpoints: ({ mutation, query }) => ({
    addUserClient: mutation<void, { userId: string; clientId: string }>({
      query: ({ userId, clientId }) => ({
        url: USER_CLIENTS_URL(),
        method: HttpMethods.POST,
        body: { userId, clientId },
      }),
      invalidatesTags: ["Users", "UserWithUnassignedClients"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUserClients: query<any, void>({
      providesTags: ["UserClients"],
      query: () => ({
        url: USER_CLIENTS_URL(),
        method: HttpMethods.GET,
      }),
    }),
  }),
});

export const { useAddUserClientMutation, useGetUserClientsQuery } =
  userClientsApi;
