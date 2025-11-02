import z from "zod";

import {
  namedBaseSchema,
  type NamedBaseType,
} from "../base.type";

export const flowActivitySchema = z
  .object({
    type: z.enum(["email", "sms", "voice"]),
  })
  .extend(namedBaseSchema.shape);

// export const transformSchema = flowActivitySchema.transform((base) => {
//   const { ...rest } = base; // omits

//   return {
//     ...rest,
//   } satisfies FlowActivity;
// });

export type FlowActivity = z.infer<typeof flowActivitySchema> & NamedBaseType;
