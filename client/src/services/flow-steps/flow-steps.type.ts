import z from "zod";

import { namedBaseSchema } from "../base.type";

export const createFlowStepSchema = z.object({
  name: z.string(),
  order: z.number(),
  activities: z.array(z.uuid()),
  flowId: z.uuid().nullish(),
});

export const updateFlowStepSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  order: z.number().optional(),
  // activities: z.array(z.uuid()).optional(),
});

export const flowStepSchema = z
  .object({
    order: z.number(),
    // Add other properties as needed
  })
  .extend(namedBaseSchema.shape);

export type FlowStep = z.infer<typeof flowStepSchema>;
export type CreateFlowStep = z.infer<typeof createFlowStepSchema>;
export type UpdateFlowStep = z.infer<typeof updateFlowStepSchema>;
