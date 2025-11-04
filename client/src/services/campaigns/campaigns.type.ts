import z from "zod";

import {
  namedBaseSchema,
  type NamedBaseType,
} from "../base.type";

export const createCampaignSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.uuid(),
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.uuid(),
  flowId: z.uuid(),
  campaignFlowSteps: z
    .array(
      z.object({
        scheduledAt: z.date(),
        dueAt: z.date(),
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
    client: z.object({
      id: z.uuid(),
      name: z.string(),
    }),

    flow: z
      .object({
        id: z.uuid(),
        name: z.string(),
      })
      .extend(namedBaseSchema.shape)
      .nullable(),
  })
  .extend(namedBaseSchema.shape);

// export const transformSchema = flowActivitySchema.transform((base) => {
//   const { ...rest } = base; // omits

//   return {
//     ...rest,
//   } satisfies FlowActivity;
// });

export type Campaign = z.infer<typeof campaignSchema> & NamedBaseType;
export type CreateCampaign = z.infer<typeof createCampaignSchema>;
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;
