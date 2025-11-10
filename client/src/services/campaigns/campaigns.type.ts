import z from "zod";

import { namedBaseSchema } from "../base.type";

export const createCampaignSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.uuid(),
});

export const queryCampaignSchema = z.object({
  clientId: z.string().nullable().optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.uuid(),
  flowId: z.uuid(),
  campaignFlowSteps: z
    .array(
      z.object({
        flowStepId: z.uuid(),
        scheduledAt: z.date().optional(),
        dueAt: z.date().optional(),
      }),
    )
    .optional(),
});

export const campaignSchema = z
  .object({
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.string(),
    client: z.object({}).extend(namedBaseSchema.shape),

    flow: z.object({}).extend(namedBaseSchema.shape).nullable(),
  })
  .extend(namedBaseSchema.shape);

// export const transformSchema = flowActivitySchema.transform((base) => {
//   const { ...rest } = base; // omits

//   return {
//     ...rest,
//   } satisfies FlowActivity;
// });

export type Campaign = z.infer<typeof campaignSchema>;
export type CreateCampaign = z.infer<typeof createCampaignSchema>;
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;
export type QueryCampaign = z.infer<typeof queryCampaignSchema>;
