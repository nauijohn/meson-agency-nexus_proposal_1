import { FindManyOptions, FindOptionsOrder } from "typeorm";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../bases";

interface PaginationQuery<T> {
  page?: number;
  limit?: number;
  sortField?: keyof T;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Returns TypeORM find options for pagination and sorting
 */
export function applyPaginationAndSorting<T>(
  query: PaginationQuery<T>,
  defaultSortField: keyof T = "createdAt" as keyof T,
  defaultSortOrder: "ASC" | "DESC" = "DESC",
): Pick<FindManyOptions<T>, "take" | "skip" | "order"> {
  const page = query.page && query.page > 0 ? query.page : DEFAULT_PAGE;
  const limit = query.limit && query.limit > 0 ? query.limit : DEFAULT_LIMIT;
  const sortField = query.sortField || defaultSortField;
  const sortOrder = query.sortOrder || defaultSortOrder;

  const order: FindOptionsOrder<T> = {
    [sortField]: sortOrder,
  } as FindOptionsOrder<T>; // Type assertion is needed here

  return {
    take: limit,
    skip: (page - 1) * limit,
    order,
  };
}
