import z from "zod";

export const baseSchema = z.object({
  id: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const namedBaseSchema = baseSchema.extend({
  name: z.string(),
});

export type BaseType = z.infer<typeof baseSchema>;
export type NamedBaseType = z.infer<typeof namedBaseSchema>;
