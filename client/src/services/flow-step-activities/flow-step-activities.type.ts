import z from "zod";

import { baseSchema } from "../base.type";

export const createFlowStepActivitySchema = z.object({
  flowStepId: z.uuid(),
  flowActivityId: z.uuid(),
});
export type CreateFlowStepActivity = z.infer<
  typeof createFlowStepActivitySchema
>;

export const flowStepActivitySchema = z.object({}).extend(baseSchema.shape);
export type FlowStepActivity = z.infer<typeof flowStepActivitySchema>;
