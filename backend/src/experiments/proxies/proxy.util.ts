type AsyncMethod = (...args: any[]) => Promise<unknown>;

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
