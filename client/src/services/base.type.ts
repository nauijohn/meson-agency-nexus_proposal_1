import z from "zod";

export const DEFAULT_PAGINATION_LIMIT = 20;

export const baseSchema = z.object({
  id: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});
export type BaseType = z.infer<typeof baseSchema>;

export const namedBaseSchema = baseSchema.extend({
  name: z.string(),
});
export type NamedBaseType = z.infer<typeof namedBaseSchema>;

export const paginationArgSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();
export type PaginationArgs = z.infer<typeof paginationArgSchema>;

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  });
export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const idParamSchema = z.object({
  id: z.uuid(),
});
export type IdParam = z.infer<typeof idParamSchema>;
