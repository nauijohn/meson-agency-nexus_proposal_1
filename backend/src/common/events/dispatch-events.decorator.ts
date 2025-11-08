type AsyncMethod = (...args: any[]) => Promise<unknown>;

export interface EventfulService<E = unknown, P = unknown> {
  events: { event: E; eventPayload: P }[];
  eventsService: {
    detectEvents: (events: { event: E; eventPayload: P }[]) => Promise<unknown>;
  };
}

export function DispatchEvents() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as AsyncMethod;

    descriptor.value = async function (
      this: EventfulService,
      ...args: unknown[]
    ) {
      console.log("DispatchEvents decorator triggered...");
      const result = (await originalMethod.apply(this, args)) as AsyncMethod;

      // Check if the class has events and eventsService
      if (
        this.eventsService &&
        Array.isArray(this.events) &&
        this.events.length > 0
      ) {
        await this.eventsService.detectEvents(this.events);
        this.events = [];
      } else {
        console.log("No events to dispatch...");
      }
      return result;
    };
    return descriptor;
  };
}
