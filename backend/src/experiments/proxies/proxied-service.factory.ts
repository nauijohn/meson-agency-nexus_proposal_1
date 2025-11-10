import { LoggerService } from "../../common/global/logger/logger.service";
import { createServiceProxy } from "./proxy.util";

// type Constructor<T = any> = new (...args: any[]) => T;

// export function createProxiedProvider<T extends object>(
//   ServiceClass: Constructor<T>,
//   handlerOverrides?: {
//     before?: (
//       method: string,
//       args: any[],
//       cls: ClsService,
//       logger: LoggerService,
//     ) => void | Promise<void>;
//     after?: (
//       method: string,
//       result: any,
//       cls: ClsService,
//       logger: LoggerService,
//     ) => void | Promise<void>;
//   },
// ) {
//   return {
//     provide: ServiceClass,
//     useFactory: (cls: ClsService, logger: LoggerService) => {
//       const instance = new ServiceClass();
//       return createServiceProxy<T>(instance, {
//         before: async (method, args) => {
//           if (handlerOverrides?.before) {
//             await handlerOverrides.before(method, args, cls, logger);
//           } else {
//             logger.log(`[${ServiceClass.name}.${method}] starting`);
//           }
//         },
//         after: async (method, result) => {
//           if (handlerOverrides?.after) {
//             await handlerOverrides.after(method, result, cls, logger);
//           } else {
//             cls.set(`${method}_result`, result);
//           }
//         },
//       });
//     },
//     inject: [ClsService, LoggerService],
//   };
// }

export function createProxiedProvider<T extends object, Deps extends any[]>(
  ServiceClass: new (...args: Deps) => T,
  injectDeps: any[] = [], // list of providers to inject
  handlerOverrides?: {
    before?: (
      method: string,
      args: any[],
      // cls: ClsService,
      logger: LoggerService,
    ) => void | Promise<void>;
    after?: (
      method: string,
      result: any,
      // cls: ClsService,
      logger: LoggerService,
    ) => void | Promise<void>;
  },
) {
  return {
    provide: ServiceClass,
    useFactory: (logger: LoggerService, ...deps: Deps) => {
      const instance = new ServiceClass(...deps); // DI dependencies injected
      logger.parentClassName = `[${ServiceClass.name}]`; // reset method name
      return createServiceProxy<T>(instance, {
        before: async (method, args) => {
          if (handlerOverrides?.before) {
            await handlerOverrides.before(method, args, logger);
          } else {
            logger.methodName = method;
            logger.log("starting...");
          }
        },
        after: async (method, result) => {
          if (handlerOverrides?.after) {
            await handlerOverrides.after(method, result, logger);
          } else {
            logger.log(`[${ServiceClass.name}.${method}] finished`);
          }
        },
      });
    },
    inject: [LoggerService, ...injectDeps],
  };
}
