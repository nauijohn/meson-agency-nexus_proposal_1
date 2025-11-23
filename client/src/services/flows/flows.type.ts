import z from "zod";

import {
  baseSchema,
  namedBaseSchema,
} from "../base.type";

export const createFlowSchema = z.object({
  name: z.string(),
  steps: z.array(
    z.object({
      name: z.string(),
      order: z.number(),
      activities: z.array(z.uuid()),
    }),
  ),
});

export const flowSchema = z
  .object({
    steps: z.array(
      z
        .object({
          order: z.number(),
          activities: z.array(
            z
              .object({
                activity: z.any().nullable(),
              })
              .extend(baseSchema.shape),
          ),
        })
        .extend(namedBaseSchema.shape),
    ),
  })
  .extend(namedBaseSchema.shape);

export type Flow = z.infer<typeof flowSchema>;
export type CreateFlow = z.infer<typeof createFlowSchema>;
