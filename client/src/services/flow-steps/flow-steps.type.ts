import z from "zod";

import {
  namedBaseSchema,
  type NamedBaseType,
} from "../base.type";

export const flowStepSchema = z
  .object({
    order: z.number(),
    // Add other properties as needed
  })
  .extend(namedBaseSchema.shape);

export type FlowStep = z.infer<typeof flowStepSchema> & NamedBaseType;
