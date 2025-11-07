import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

/**
 * Base class for domain-level event services
 */
export abstract class DomainEventsService<TEvents extends string> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly eventEmitter: EventEmitter2) {}

  /** Generic emit method */
  emit(event: TEvents, payload?: unknown) {
    this.eventEmitter.emit(event, payload);
  }

  /**
   * Detect events dynamically from an array of {event, eventPayload} objects
   */
  detectEvents(
    events: Array<{ event: TEvents; eventPayload?: unknown }>,
  ): void {
    events.forEach(({ event, eventPayload }) => {
      const handler = this.eventHandlers[event];
      if (handler) {
        handler(eventPayload);
      } else {
        this.logger.warn(`No handler found for event: ${event}`);
      }
    });
  }

  /**
   * Subclasses must provide a mapping of event names → handler functions
   */
  protected abstract get eventHandlers(): Record<
    TEvents,
    (payload?: unknown) => void
  >;
}
