import api, { HttpMethods } from "./api";

const Endpoints = {
  USERS: (id?: string) => (id ? `users/${id}` : `users`),
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  unassignedClients?: Array<{
    id: string;
    name: string;
  }>;
  clients?: Array<{
    id: string;
    name: string;
  }>;
  clientIds?: string[];
};

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => Endpoints.USERS(),
      providesTags: ["Users"],
    }),
    getUserWithUnassignedClients: builder.query<User, { id: string }, void>({
      query: ({ id }) => `${Endpoints.USERS(id)}?includeUnassignedClients=true`,
      providesTags: ["UserWithUnassignedClients"],
    }),

    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: Endpoints.USERS(),
        method: HttpMethods.POST,
        body,
      }),
    }),

    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: Endpoints.USERS(id),
        method: HttpMethods.PATCH,
        body,
      }),
      invalidatesTags: ["Users", "UserWithUnassignedClients"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserWithUnassignedClientsQuery,
  useAddUserMutation,
  useUpdateUserMutation,
} = usersApi;
