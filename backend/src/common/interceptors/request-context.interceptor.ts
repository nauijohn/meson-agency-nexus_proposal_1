import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const data: {
      context: {
        requestId: string;
        url: string;
        method: string;
        originalUrl: string;
      };
    } = context.switchToRpc().getData();

    const requestId = data.context?.requestId;
    const url = data.context?.url;
    const method = data.context?.method;
    const originalUrl = data.context?.originalUrl;

    return new Observable((observer) => {
      this.cls.run(() => {
        // set values inside this CLS context
        this.cls.set("requestId", requestId);
        this.cls.set("url", url);
        this.cls.set("method", method);
        this.cls.set("originalUrl", originalUrl);

        next.handle().subscribe({
          next: (val) => observer.next(val),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
