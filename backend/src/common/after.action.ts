/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export function AfterAction(callback: (result: any, args: any[]) => void) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      await callback.call(this, result, args);
      return result;
    };
  };
}

// common/decorators/after-events.decorator.ts
export function AfterEvents() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Check if the class has events and eventsService
      if (
        this.eventsService &&
        Array.isArray(this.events) &&
        this.events.length > 0
      ) {
        await this.eventsService.detectEvents(this.events);
        this.events = [];
      }

      return result;
    };

    return descriptor;
  };
}
