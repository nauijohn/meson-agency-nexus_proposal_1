import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const tokensSchema = z.object({
  accessToken: z.string(),
  // refreshToken: z.undefined(),
});

export const meSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  roles: z.array(z.string()),
});

export type Tokens = z.infer<typeof tokensSchema>;

export type SignIn = z.infer<typeof signInSchema>;

export type Me = z.infer<typeof meSchema>;
