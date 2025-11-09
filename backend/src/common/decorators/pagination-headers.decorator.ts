import { applyDecorators, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor } from "../interceptors/pagination.interceptor";

export function PaginationHeaders() {
  return applyDecorators(UseInterceptors(PaginationInterceptor));
}
