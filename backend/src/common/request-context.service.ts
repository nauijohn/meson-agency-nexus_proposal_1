import { AsyncLocalStorage } from "async_hooks";

// common/request-context.service.ts
import { Injectable } from "@nestjs/common";

export interface RequestContext {
  requestId: string;
  url: string;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  run(context: RequestContext, callback: (...args: any[]) => any) {
    this.asyncLocalStorage.run(context, callback);
  }

  get<T extends keyof RequestContext>(key: T): RequestContext[T] | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store ? store[key] : undefined;
  }
}
