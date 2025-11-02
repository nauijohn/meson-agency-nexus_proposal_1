import z from "zod";

import {
  baseSchema,
  namedBaseSchema,
} from "../base.type";

export const userClientSchema = z.object({
  client: z.object({}).extend(namedBaseSchema.shape),
  user: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.email(),
    })
    .extend(baseSchema.shape),
  assignedDate: z.string(),
});

export const transformedUserClientSchema = z.object({
  clientId: z.string(),
  clientName: z.string(),
  userId: z.string(),
  userName: z.string(),
  assignedDate: z.string(),
});

export const transformSchema = userClientSchema.transform((base) => {
  const { client, user, ...rest } = base; // omits

  return {
    clientId: client.id,
    clientName: client.name,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    ...rest,
  } satisfies TransformedUserClient;
});

export type UserClient = z.infer<typeof userClientSchema>;
export type TransformedUserClient = z.infer<typeof transformedUserClientSchema>;
