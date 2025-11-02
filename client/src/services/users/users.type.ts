import z from "zod";

import {
  baseSchema,
  type BaseType,
  namedBaseSchema,
  type NamedBaseType,
} from "../base.type";

const clientSchema = z.object({}).extend(namedBaseSchema.shape);

export const userSchema = z
  .object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    clients: z.array(clientSchema),
    unassignedClients: z.array(clientSchema).optional(),
  })
  .extend(baseSchema.shape);

export const transformedUserSchema = z
  .object({
    email: z.email(),
    clients: z.array(clientSchema),
    unassignedClients: z.array(clientSchema).optional(),
  })
  .extend(namedBaseSchema.shape);

export const transformSchema = userSchema.transform((base) => {
  const { firstName, lastName, ...rest } = base; // omits

  return {
    name: `${firstName} ${lastName}`,
    ...rest,
  } satisfies TransformedUser;
});

export type User = z.infer<typeof userSchema> & BaseType;
export type TransformedUser = z.infer<typeof transformedUserSchema> &
  NamedBaseType;
