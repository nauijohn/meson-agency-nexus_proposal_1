/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// common/utils/service-proxy.factory.ts
export function createServiceProxy<T extends object>(service: T) {
  console.log("HOOOOT...");
  return new Proxy(service, {
    get(target: T, prop: string | symbol, receiver: any) {
      const orig = (target as any)[prop];

      if (typeof orig === "function") {
        return async (...args: unknown[]) => {
          const result = await orig.apply(target, args);

          // Unsafe, but avoids TypeScript errors
          if (
            (target as any).eventsService &&
            (target as any).events?.length > 0
          ) {
            await (target as any).eventsService.detectEvents(
              (target as any).events,
            );
            (target as any).events = [];
          }

          return result;
        };
      }

      return orig;
    },
  });
}
