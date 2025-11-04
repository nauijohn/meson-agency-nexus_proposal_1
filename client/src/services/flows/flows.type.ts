import z from "zod";

import {
  namedBaseSchema,
  type NamedBaseType,
} from "../base.type";

// {
// 	"name": "New Flow",
// 	"steps": [
// 		{
// 			"name": "Step 1",
// 			"order": 1,
// 			"activities": [
// 				"2d36c4a9-35ff-4b7f-b333-1fe1a3ecfe56",
// 				"c7be29bd-d1a3-416c-8691-1655e614622b"
// 			]
// 		}
// 	]
// }

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
          name: z.string(),
          order: z.number(),
          stepActivities: z.array(
            z.object({
              activity: z.object({
                name: z.string(),
              }),
            }),
          ),
        })
        .extend(namedBaseSchema.shape),
    ),
  })
  .extend(namedBaseSchema.shape);

// export const transformSchema = flowActivitySchema.transform((base) => {
//   const { ...rest } = base; // omits

//   return {
//     ...rest,
//   } satisfies FlowActivity;
// });

export type Flow = z.infer<typeof flowSchema> & NamedBaseType;
export type CreateFlow = z.infer<typeof createFlowSchema>;
