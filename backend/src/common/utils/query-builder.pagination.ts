import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../bases";

interface PaginationOptions {
  page: number;
  limit: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Apply pagination and sorting to a TypeORM QueryBuilder
 */
export function applyPaginationAndSorting<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: PaginationOptions,
): SelectQueryBuilder<T> {
  const { sortField = "createdAt", sortOrder = "DESC" } = options;
  const page = options.page && options.page > 0 ? options.page : DEFAULT_PAGE;
  const limit =
    options.limit && options.limit > 0 ? options.limit : DEFAULT_LIMIT;

  qb.skip((page - 1) * limit).take(limit);
  qb.orderBy(`${qb.alias}.${sortField}`, sortOrder);

  return qb;
}
