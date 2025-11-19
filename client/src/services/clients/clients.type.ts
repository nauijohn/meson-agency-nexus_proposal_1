import z from "zod";

import { namedBaseSchema } from "../base.type";

export const clientSchema = z.object({}).extend(namedBaseSchema.shape);

export type Client = z.infer<typeof clientSchema>;
