import { ClsService } from "nestjs-cls";

import { LoggerService } from "../common/global/logger/logger.service";

type AsyncMethod = (...args: any[]) => Promise<unknown>;
type Constructor<T = any> = new (...args: any[]) => T;

export function createProxy<T extends object>(
  target: T,
  handler: {
    before?: (method: string, args: any[]) => void | Promise<void>;
    after?: (method: string, result: any) => void | Promise<void>;
  },
): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const orig = Reflect.get(target, prop, receiver);

      // If it's a function (method), wrap it
      if (typeof orig === "function") {
        return async (...args: any[]) => {
          if (handler.before) await handler.before(prop as string, args);
          const result = (await orig.apply(target, args)) as AsyncMethod;
          if (handler.after) await handler.after(prop as string, result);
          return result;
        };
      }

      // Non-function property → return as is
      return orig;
    },
  });
}

export function createProxiedProvider<T extends object>(
  ServiceClass: Constructor<T>,
  handlerOverrides?: {
    before?: (
      method: string,
      args: any[],
      cls: ClsService,
      logger: LoggerService,
    ) => void | Promise<void>;
    after?: (
      method: string,
      result: any,
      cls: ClsService,
      logger: LoggerService,
    ) => void | Promise<void>;
  },
) {
  return {
    provide: ServiceClass,
    useFactory: (cls: ClsService, logger: LoggerService) => {
      const instance = new ServiceClass();
      return createServiceProxy<T>(instance, {
        before: async (method, args) => {
          if (handlerOverrides?.before) {
            await handlerOverrides.before(method, args, cls, logger);
          } else {
            logger.log(`[${ServiceClass.name}.${method}] starting`);
          }
        },
        after: async (method, result) => {
          if (handlerOverrides?.after) {
            await handlerOverrides.after(method, result, cls, logger);
          } else {
            cls.set(`${method}_result`, result);
          }
        },
      });
    },
    inject: [ClsService, LoggerService],
  };
}

export function createServiceProxy<T extends object>(
  service: T,
  {
    before,
    after,
  }: {
    before?: (method: string, args: any[]) => void | Promise<void>;
    after?: (method: string, result: any) => void | Promise<void>;
  },
): T {
  return new Proxy(service, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      if (typeof original !== "function") return original;

      return async (...args: any[]) => {
        if (before) await before(prop as string, args);
        const result = (await original.apply(target, args)) as AsyncMethod;
        if (after) await after(prop as string, result);
        return result;
      };
    },
  });
}
