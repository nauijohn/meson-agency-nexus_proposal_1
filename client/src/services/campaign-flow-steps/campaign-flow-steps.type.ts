import z from "zod";

import { baseSchema } from "../base.type";
import { campaignSchema } from "../campaigns/campaigns.type";
import { flowStepSchema } from "../flow-steps/flow-steps.type";

// const campaignSchema = z
//   .object({
//     description: z.string().optional(),
//     startDate: z.string().optional(),
//     endDate: z.string().optional(),
//     status: z.string().optional(),
//     clientId: z.uuid().optional(),
//   })
//   .extend(namedBaseSchema.shape);

// const flowStepSchema = z
//   .object({
//     order: z.number().optional(),
//   })
//   .extend(namedBaseSchema.shape);

export const campaignFlowStepSchema = z
  .object({
    completedAt: z.string().nullable().optional(),
    scheduledAt: z.string().nullable().optional(),
    dueAt: z.string().nullable().optional(),
    campaign: campaignSchema.omit({ flow: true }),
    flowStep: flowStepSchema,
  })
  .extend(baseSchema.shape);

export type CampaignFlowStep = z.infer<typeof campaignFlowStepSchema>;
