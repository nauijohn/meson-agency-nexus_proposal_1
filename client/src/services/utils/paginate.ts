import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

import type { PaginatedResponse } from "../base.type";

export function paginate<T>(
  items: T[],
  meta: FetchBaseQueryMeta | undefined,
): PaginatedResponse<T> {
  return {
    items,
    totalCount: parseInt(
      meta?.response?.headers.get("X-Total-Count") || "0",
      10,
    ),
    page: parseInt(meta?.response?.headers.get("X-Page") || "1", 10),
    limit: parseInt(meta?.response?.headers.get("X-Limit") || "10", 10),
    totalPages: parseInt(
      meta?.response?.headers.get("X-Total-Pages") || "1",
      10,
    ),
    hasNextPage: meta?.response?.headers.get("X-Has-Next") === "true",
    hasPrevPage: meta?.response?.headers.get("X-Has-Previous") === "true",
  };
}
