import api, {
  API_TAGS,
  HttpMethods,
} from "../api";
import {
  type GetUserArgs,
  type TransformedUser,
  transformedUserSchema,
  transformSchema,
  type User,
  userSchema,
} from "./users.type";

const URL = (id?: string) => (id ? `users/${id}` : `users`);

export type UserResponse = Omit<User, "firstName" | "lastName"> & {
  name: string;
};

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      providesTags: [API_TAGS.USERS],
      query: () => URL(),
      responseSchema: userSchema.array(),
    }),

    getUser: builder.query<User, GetUserArgs>({
      providesTags: [API_TAGS.USER],
      query: ({ id }) => URL(id),
      responseSchema: userSchema,
    }),

    getTransformedUsers: builder.query<TransformedUser[], void>({
      providesTags: [API_TAGS.USERS],
      query: () => URL(),
      rawResponseSchema: userSchema.array(),
      responseSchema: transformedUserSchema.array(),
      transformResponse: (response) => transformSchema.array().parse(response),
    }),

    getUserWithUnassignedClients: builder.query<User, { id: string }, void>({
      providesTags: [API_TAGS.USER_WITH_UNASSIGNED_CLIENTS],
      query: ({ id }) => `${URL(id)}?includeUnassignedClients=true`,
    }),

    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: URL(),
        method: HttpMethods.POST,
        body,
      }),
    }),

    updateUser: builder.mutation<User, Partial<User>>({
      invalidatesTags: [API_TAGS.USERS, API_TAGS.USER_WITH_UNASSIGNED_CLIENTS],
      query: ({ id, ...body }) => ({
        url: URL(id),
        method: HttpMethods.PATCH,
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetTransformedUsersQuery,
  useGetUserWithUnassignedClientsQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = usersApi;

export default usersApi;
