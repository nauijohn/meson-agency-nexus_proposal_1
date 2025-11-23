import z from "zod";

import {
  baseSchema,
  namedBaseSchema,
} from "../base.type";

export const getUserArgsSchema = z.object({
  id: z.uuid(),
});

export const userSchema = z
  .object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(z.string()),
  })
  .extend(baseSchema.shape);

export const transformedUserSchema = z
  .object({
    email: z.email(),
  })
  .extend(namedBaseSchema.shape);

export const transformSchema = userSchema.transform((base) => {
  const { firstName, lastName, ...rest } = base; // omits

  return {
    name: `${firstName} ${lastName}`,
    ...rest,
  } satisfies TransformedUser;
});

export type User = z.infer<typeof userSchema>;
export type TransformedUser = z.infer<typeof transformedUserSchema>;

export type GetUserArgs = z.infer<typeof getUserArgsSchema>;
