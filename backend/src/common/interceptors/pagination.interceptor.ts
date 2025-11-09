import { Request, Response } from "express";
import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../bases/dto/pagination.dto";

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Access the HTTP request and response objects
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // Extract query parameters
    const query = request.query as { page: string; limit: string };

    return next.handle().pipe(
      tap(() => {
        const total = this.cls.get<number>("total") || 0; // available because saveRes: true
        const page = +query.page || DEFAULT_PAGE;
        const limit = +query.limit || DEFAULT_LIMIT;
        const totalPages = Math.ceil(total / (+query.limit || DEFAULT_LIMIT));
        const hasNext = `${page * limit < total}`;
        const hasPrevious = `${page > 1}`;

        if (response) {
          response.setHeader("X-Total-Count", total);
          response.setHeader("X-Page", page);
          response.setHeader("X-Limit", limit);
          response.setHeader("X-Total-Pages", totalPages);
          response.setHeader("X-Has-Next", hasNext);
          response.setHeader("X-Has-Previous", hasPrevious);
        }
      }),
    );
  }
}
