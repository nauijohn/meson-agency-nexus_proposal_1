import z from "zod";

import { namedBaseSchema } from "../base.type";
import { userSchema } from "../users/users.type";

export const userClientSchema = z.object({
  client: z.object({}).extend(namedBaseSchema.shape),
  user: userSchema,
  assignedDate: z.string(),
});

export const userClientQuerySchema = z.object({
  userId: z.string().optional(),
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
export type UserClientQuery = z.infer<typeof userClientQuerySchema>;
