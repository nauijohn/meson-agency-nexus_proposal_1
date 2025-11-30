import api, { HttpMethods } from "../api";
import {
  type Me,
  meSchema,
  type SignIn,
  type Tokens,
  tokensSchema,
} from "./authtype";

const URL = (category?: string) => (category ? `auth/${category}` : `auth`);

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<Tokens, SignIn>({
      query: (body) => ({
        url: URL("sign-in"),
        method: HttpMethods.POST,
        body,
        credentials: "include", // required if refresh token is in cookies
      }),
      responseSchema: tokensSchema,
    }),
    me: builder.query<Me, void>({
      query: () => {
        return {
          url: URL("me"),
          method: HttpMethods.GET,
        };
      },
      responseSchema: meSchema,
    }),
  }),
});

export const { useSignInMutation, useMeQuery } = authApi;

export default authApi;
